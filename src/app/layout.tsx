import { Analytics } from "@vercel/analytics/next";

import Navbar from "~/components/UI/navbar";
import AuthProvider from "~/components/auth-provider";
import ToastWrapper from "./ToastWrapper";
import { TRPCReactProvider } from "~/trpc/react";
import "~/styles/globals.css";

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Analytics />
        <AuthProvider>
          <Navbar />
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </AuthProvider>
        <ToastWrapper />
      </body>
    </html>
  );
}
