import { lookup } from "node:dns/promises";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import ipaddr from "ipaddr.js";
import { RecipeUrlSchema } from "~/server/api/models/recipe-url";

const maxBytes = 3 * 1024 * 1024;
const maxRedirects = 4;

async function resolvePublicAddress(url: URL, signal: AbortSignal) {
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = await new Promise<Awaited<ReturnType<typeof lookup>>[]>(
    (resolve, reject) => {
      signal.throwIfAborted();
      const abort = () => reject(signal.reason as unknown);
      signal.addEventListener("abort", abort, { once: true });
      void lookup(hostname, { all: true })
        .then(resolve, reject)
        .finally(() => {
          signal.removeEventListener("abort", abort);
        });
    },
  );
  if (
    !addresses.length ||
    addresses.some(({ address }) => {
      const parsed = ipaddr.process(address);
      return (
        parsed.range() !== "unicast" ||
        (parsed.kind() === "ipv6" && !address.match(/^[23]/i))
      );
    })
  ) {
    throw new Error("Only public recipe websites can be imported.");
  }
  return addresses[0]!;
}

async function readPage(url: URL, signal: AbortSignal) {
  const { address, family } = await resolvePublicAddress(url, signal);
  const send = url.protocol === "https:" ? httpsRequest : httpRequest;
  return new Promise<{ html: string } | { redirect: string }>(
    (resolve, reject) => {
      const request = send(
        url,
        {
          agent: false,
          family,
          signal,
          // Keep the original host for HTTPS certificate verification. Connect to the checked address.
          lookup: (_hostname, _options, callback) =>
            callback(null, address, family),
          headers: {
            "User-Agent": "Forked Recipe Import/1.0",
            Accept: "text/html, application/xhtml+xml",
            "Accept-Encoding": "identity",
          },
        },
        (response) => {
          const status = response.statusCode ?? 0;
          if (
            [301, 302, 303, 307, 308].includes(status) &&
            response.headers.location
          ) {
            resolve({ redirect: response.headers.location });
            response.destroy();
            return;
          }
          if (
            status !== 200 ||
            !/^(text\/html|application\/xhtml\+xml)(?:;|$)/i.test(
              response.headers["content-type"] ?? "",
            )
          ) {
            reject(
              new Error("The recipe website did not return a readable page."),
            );
            response.destroy();
            return;
          }
          const chunks: Buffer[] = [];
          let length = 0;
          response.on("data", (chunk: Buffer) => {
            length += chunk.length;
            if (length > maxBytes) {
              response.destroy(
                new Error("The recipe page is too large to import."),
              );
              return;
            }
            chunks.push(chunk);
          });
          response.once("error", reject);
          response.once("end", () =>
            resolve({ html: Buffer.concat(chunks).toString("utf8") }),
          );
        },
      );
      request.once("error", reject);
      request.end();
    },
  );
}

export async function fetchRecipePage(value: string) {
  const signal = AbortSignal.timeout(8000);
  let url = new URL(RecipeUrlSchema.parse(value));
  for (let hop = 0; hop <= maxRedirects; hop++) {
    const page = await readPage(url, signal);
    if ("html" in page) return page.html;
    url = new URL(RecipeUrlSchema.parse(new URL(page.redirect, url).href));
  }
  throw new Error("The recipe page redirected too many times.");
}
