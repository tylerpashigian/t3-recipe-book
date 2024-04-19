import Head from "next/head";
import WithNavBar from "~/components/UI/with-nabvar";

import Link from "next/link";
import React from "react";

import { api } from "~/utils/api";

const Recipes = () => {
  const { data, isLoading } = api.recipes.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Recipes</title>
        <meta name="description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WithNavBar>
        <main className="flex flex-col">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl">
                {isLoading && "Loading..."}
                {!isLoading &&
                  data &&
                  data?.length > 0 &&
                  `${data.length} recipe(s)`}
              </p>
              <>
                {!isLoading && data && data.length > 0
                  ? data.map((recipe) => (
                      <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
                        <p>{recipe.name}</p>
                      </Link>
                    ))
                  : null}
                {!isLoading && (!data || data.length === 0) && <p>No data</p>}
              </>
            </div>
          </div>
        </main>
      </WithNavBar>
    </>
  );
};

export default Recipes;