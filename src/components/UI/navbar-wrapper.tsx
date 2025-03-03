import { getServerSession } from "next-auth";

import Navbar from "./navbar";
import { authOptions } from "~/server/auth/config";

export default async function NavbarWrapper() {
  const sessionPromise = getServerSession(authOptions);
  const session = await sessionPromise;

  return <Navbar session={session} />;
}
