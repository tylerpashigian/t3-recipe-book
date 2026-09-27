import NextAuth from "next-auth";
import { sharedAuthConfig } from "~/server/auth/shared";

export const { auth: middleware } = NextAuth(sharedAuthConfig);

export const config = {
  // Session renewal only. Pages and procedures enforce access independently.
  matcher: ["/((?!api(?:/|$)|_next(?:/|$)|.*\\.[^/]+$).*)", "/api/trpc/:path*"],
};
