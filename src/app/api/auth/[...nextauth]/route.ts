import NextAuth from "next-auth";

import { authOptions } from "~/server/auth/config";

// TODO: fix this casting to be the proper type
const handler = NextAuth(authOptions) as (request: Request) => void;

export { handler as GET, handler as POST };
