import { useSession } from "next-auth/react";
// import { getServerSession } from "next-auth";

import Navbar from "./navbar";
// import { authOptions } from "~/server/auth/config";

export default function NavbarWrapper() {
  // TODO: this is a workaround to get the session in the client component
  // look into this with the TODO in the layout.tsx file

  // const sessionPromise = getServerSession(authOptions);
  // const session = await sessionPromise;

  const session = useSession();

  return <Navbar session={session.data} />;
}
