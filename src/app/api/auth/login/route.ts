import { z } from "zod";

import { prisma } from "../../../../server/db";
import { hashPassword } from "~/utils/conversions";
import { parseRequestBody } from "~/utils/api";

const SignInUserRequest = z.object({
  username: z.string(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await parseRequestBody(req, SignInUserRequest);
    const parsedRequest = SignInUserRequest.parse(body);

    const { username, password } = parsedRequest;

    if (!username || !password) {
      return new Response(JSON.stringify({ message: "invalid inputs" }), {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        email: true,
        password: true,
        image: true,
        username: true,
      },
    });

    if (user && user.password === hashPassword(password).toString()) {
      // Intentionally excluding password from user object
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...publicUser } = user;
      return new Response(JSON.stringify(publicUser), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ message: "invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.log("Error", e);
    return new Response(JSON.stringify({ message: "server error" }), {
      status: 500,
    });
  }
}
