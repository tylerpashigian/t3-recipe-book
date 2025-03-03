import { Toaster } from "react-hot-toast";

import NavbarWrapper from "~/components/UI/navbar-wrapper";
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
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
      />
      <body>
        <NavbarWrapper />
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
