"use client";

import { Analytics } from "@vercel/analytics/next";

import NavbarWrapper from "~/components/UI/navbar-wrapper";
import ToastWrapper from "./ToastWrapper";
import { TRPCReactProvider } from "~/trpc/react";
import "~/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "~/components/UI/tooltip";

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
        {/* <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {/* TODO: is there a better way to give access to client auth context
        without wrapping the whole app? */}
        <SessionProvider>
          <TooltipProvider>
            <Analytics />
            <NavbarWrapper />
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <ToastWrapper />
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
