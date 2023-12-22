import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { prisma } from "../../../server/db";
import { hashPassword } from "./register";

const SignInUserRequest = z.object({
  username: z.string(),
  password: z.string().min(6),
});

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    await loginUserHandler(req, res);
  } else {
    return res.status(405);
  }
}
async function loginUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const parsedRequest = SignInUserRequest.parse(req.body);
  const { username, password } = parsedRequest;
  if (!username || !password) {
    return res.status(400).json({ message: "invalid inputs" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
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
      return res.status(200).json(publicUser);
    } else {
      return res.status(401).json({ message: "invalid credentials" });
    }
  } catch (e) {
    throw new Error("e");
  }
}
