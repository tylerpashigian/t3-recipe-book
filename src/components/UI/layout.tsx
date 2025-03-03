import React from "react";
import Navbar from "./navbar";
import { useSession } from "next-auth/react";

type Props = {
  children: JSX.Element;
};

export default function Layout({ children }: Props) {
  const { data: session } = useSession();
  return (
    <div className="text-black">
      <Navbar session={session} />
      {children}
    </div>
  );
}
