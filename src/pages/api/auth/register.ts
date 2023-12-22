import { SHA256 as sha256 } from "crypto-js";
// We impot our prisma client
import { prisma } from "../../../server/db";
// Prisma will help handle and catch errors
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const CreateUserRequest = z.object({
  username: z.string(),
  password: z.string().min(6), // Ensure password is at least 6 characters
});

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    // create user
    await createUserHandler(req, res);
  } else {
    return res.status(405).json({ message: "Method Not allowed" });
  }
}
// We hash the user entered password using crypto.js
export const hashPassword = (string: string) => {
  return sha256(string).toString();
};

// function to create user in our database
async function createUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const errors = [];

  const parsedRequest = CreateUserRequest.parse(req.body);
  const { password } = parsedRequest;

  if (password.length < 6) {
    errors.push("password length should be more than 6 characters");
    return res.status(400).json({ errors });
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
    return res.status(201).json({ publicUser });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(400).json({ message: e.message });
      }
      return res.status(400).json({ message: e.message });
    }
  }
}
