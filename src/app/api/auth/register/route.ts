import { z } from "zod";
import { Prisma } from "@prisma/client";

import { prisma } from "../../../../server/db";
import { hashPassword } from "~/utils/conversions";
import { parseRequestBody } from "~/utils/api";

const CreateUserRequest = z.object({
  username: z.string(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const errors = [];
    const body = await parseRequestBody(req, CreateUserRequest);
    const parsedRequest = CreateUserRequest.parse(body);
    const { password } = parsedRequest;

    if (password.length < 6) {
      errors.push("password length should be more than 6 characters");
      return new Response(JSON.stringify({ errors }), {
        status: 400,
      });
    }

    try {
      const user = await prisma.user.create({
        data: {
          ...parsedRequest,
          ...(parsedRequest.password && {
            password: hashPassword(parsedRequest.password).toString(),
          }),
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...publicUser } = user;
      return new Response(JSON.stringify({ publicUser }), {
        status: 201,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          // used for debugging, probably not needed but brought over from pages router
          console.log("Code P2002");
        }
        return new Response(JSON.stringify({ message: e.message }), {
          status: 400,
        });
      }
    }
  } catch (e) {
    console.log("Error", e);
    return new Response(JSON.stringify({ message: "server error" }), {
      status: 500,
    });
  }
}
