"use client";

import Head from "next/head";
import WithNavBar from "~/components/UI/with-nabvar";

import Link from "next/link";
import React, { useState } from "react";

import { api } from "~/trpc/react";
import { Input } from "~/components/UI/input";
import { Combobox, type OptionType } from "~/components/UI/combobox";
import { categoryToOption } from "~/models/mappings/recipe";
import { Button } from "~/components/UI/button";

const Recipes = () => {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<OptionType[]>(
    [],
  );

  const { data: categories } = api.recipes.getCategories.useQuery();
  const { data, isLoading } = api.recipes.getAll.useQuery({
    query,
    categories: selectedCategories.map((category) => category.value),
  });

  return (
    <>
      <Head>
        <title>Recipes</title>
        <meta name="description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WithNavBar>
        <main className="flex flex-col">
          <div className="container flex flex-col items-center justify-center gap-12 py-8 md:py-16">
            <div className="flex w-full flex-col items-center gap-2 md:w-1/2">
              <p className="text-2xl">
                {isLoading && "Loading..."}
                {!isLoading &&
                  data &&
                  data?.length > 0 &&
                  `${data.length} recipe(s)`}
              </p>
              <Input
                onChange={(query) => setQuery(query.target.value)}
                value={query}
              />
              <Combobox
                className="w-full"
                options={[...(categories ?? []).map(categoryToOption)]}
                selected={selectedCategories}
                onChange={setSelectedCategories}
                placeholder="Select a Category..."
              />
              <>
                {!isLoading && data && data.length > 0
                  ? data.map((recipe) => (
                      <Link
                        href={`/recipe/${recipe.id}`}
                        key={`${recipe.id}-new`}
                      >
                        <Button variant={"link"}>{recipe.name}</Button>
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
