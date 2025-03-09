import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Layout from "~/components/UI/layout";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <>
          <Component {...pageProps} />
          <Toaster position="bottom-right" />
          <ReactQueryDevtools />
        </>
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
