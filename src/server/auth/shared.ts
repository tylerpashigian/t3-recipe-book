import type { DefaultSession, NextAuthConfig } from "next-auth";
import type {} from "next-auth/jwt";

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
      username?: string;
    };
  }

  interface User {
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
  }
}

// Imported by middleware: keep database clients and password verification out.
export const sharedAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.sub!,
          name: token.name,
          email: token.email,
          image: token.picture,
          username: token.username,
        },
      };
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.username = user.username;
      }
      return token;
    },
  },
  pages: { signIn: "/auth/login" },
} satisfies NextAuthConfig;
