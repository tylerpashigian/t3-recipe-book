import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const queryClient = new QueryClient();
  return (
    <Html lang="en">
      <Head />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
      />
      <body>
        <QueryClientProvider client={queryClient}>
          <Main />
          <NextScript />
        </QueryClientProvider>
      </body>
    </Html>
  );
}
