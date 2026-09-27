import "server-only";

import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { sharedAuthConfig } from "./shared";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { hashPassword } from "~/utils/conversions";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...sharedAuthConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (
            !credentials ||
            typeof credentials.username !== "string" ||
            !credentials.username ||
            typeof credentials.password !== "string" ||
            credentials.password.length < 6
          ) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
            select: {
              id: true,
              email: true,
              image: true,
              password: true,
              username: true,
            },
          });

          if (!user || user.password !== hashPassword(credentials.password)) {
            return null;
          }

          // Do not put the password hash into the JWT/session.
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, username, ...publicUser } = user;
          return { ...publicUser, username: username ?? undefined };
        } catch (e) {
          console.log("error: ", e);
          return null;
        }
      },
    }),
  ],
});
