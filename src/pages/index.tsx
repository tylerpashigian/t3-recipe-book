import Head from "next/head";

import WithNavBar from "~/components/UI/with-nabvar";
import Hero from "~/components/hero";

export default function Home() {
  return (
    <>
      <Head>
        <title>T3 Recipe Book</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WithNavBar>
        <main>
          <Hero />
        </main>
      </WithNavBar>
    </>
  );
}
