import NextAuth from "next-auth";

import { authOptions } from "~/server/auth/config";

export default NextAuth(authOptions);
