"use client";

import NavbarWrapper from "~/components/UI/navbar-wrapper";
import ToastWrapper from "./ToastWrapper";
import { TRPCReactProvider } from "~/trpc/react";
import "~/styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </head>
      <body>
        {/* TODO: is there a better way to give access to client auth context
        without wrapping the whole app? */}
        <SessionProvider>
          <NavbarWrapper />
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <ToastWrapper />
        </SessionProvider>
      </body>
    </html>
  );
}
