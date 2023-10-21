import React from "react";
import Navbar from "./navbar";

type Props = {
  children: JSX.Element;
};

export default function Layout({ children }: Props) {
  return (
    <div className="text-black">
      <Navbar />
      {children}
    </div>
  );
}
