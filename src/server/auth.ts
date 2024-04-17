import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type User,
  type DefaultUser,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      username?: string;
      // role: UserRole;
    };
  }

  interface User extends DefaultUser {
    username?: string;
    // ...other properties
    // role: UserRole;
  }
}

interface Credentials {
  username: string;
  password: string;
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // See https://next-auth.js.org/configuration/nextjs#caveats, middleware (currently) doesn't support the "database" strategy which is used by default when using an adapter (https://next-auth.js.org/configuration/options#session)
  },
  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...(token.user as User),
          id: token.sub,
        },
      };
    },
    jwt({ token, user }) {
      if (!!user) token.user = user;
      return token;
    },
  },
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
      async authorize(
        credentials: Credentials | undefined,
      ): Promise<User | null> {
        try {
          if (!credentials) return null;
          const userCredentials = {
            username: credentials.username,
            password: credentials.password,
          };

          console.log(
            `${process.env.NODE_ENV === "production" ? "https://" : ""}${
              env.NEXTAUTH_URL
            }/api/auth/login`,
          );

          const res = await fetch(
            `${process.env.NODE_ENV === "production" ? "https://" : ""}${
              env.NEXTAUTH_URL
            }/api/auth/login`,
            {
              method: "POST",
              body: JSON.stringify(userCredentials),
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const user = (await res.json()) as User | null;

          if (res.ok && user) {
            return user;
          } else {
            return null;
          }
        } catch (e) {
          console.log("error: ", e);
          return null;
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: "/auth/login",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
