import Head from "next/head";
import { useRouter } from "next/router";

import RecipeDetails from "~/components/recipe-details";

export default function Recipe() {
  // TODO: add SSR or SSG
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Recipe Details</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-2">
            <RecipeDetails id={router.query.id as string} />
          </div>
        </div>
      </main>
    </>
  );
}
