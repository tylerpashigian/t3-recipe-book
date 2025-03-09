"use client";

import { SessionProvider } from "next-auth/react";

const RecipeLayout = ({ children }: { children: React.ReactElement }) => {
  // TODO: is there a better way to give access to client auth context without wrapping the whole app?
  return <SessionProvider>{children}</SessionProvider>;
};

export default RecipeLayout;
