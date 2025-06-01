"use client";

import React, { useState } from "react";
import Head from "next/head";

import { Search } from "lucide-react";

import { useRecipes } from "~/hooks/data/recipes";
import { useRecipe } from "~/hooks/data/recipe";
import WithNavBar from "~/components/UI/with-nabvar";
import { Input } from "~/components/UI/input";
import { Combobox, type OptionType } from "~/components/UI/combobox";
import { categoryToOption } from "~/models/mappings/recipe";
import RecipeTable from "~/components/recipe/recipe-table";

const Recipes = () => {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<OptionType[]>(
    [],
  );

  const { isLoading: isRecipeLoading, categories } = useRecipe();
  const { recipes, isLoading: isRecipesLoading } = useRecipes({
    query,
    categories: selectedCategories.map((category) => category.value),
  });

  const isLoading = isRecipeLoading || isRecipesLoading;

  return (
    <>
      <Head>
        <title>Recipes</title>
        <meta name="Search all recipes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WithNavBar classes="bg-forked-neutral">
        <main className="flex w-full flex-col">
          <div className="mx-auto w-full max-w-6xl px-6 py-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-foreground">
                  All Recipes
                </h1>
                <p className="text-forked-secondary-foreground">
                  Discover delicious recipes from our community
                </p>
              </div>
            </div>

            <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row">
              <div className="relative w-full flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Search recipes..."
                  className="pl-10"
                  onChange={(query) => setQuery(query.target.value)}
                  value={query}
                />
              </div>
              <Combobox
                className="w-full sm:w-48"
                options={[...(categories ?? []).map(categoryToOption)]}
                selected={selectedCategories}
                onChange={setSelectedCategories}
                placeholder="Select a Category..."
              />
            </div>

            <RecipeTable isLoading={isLoading} recipes={recipes} />
          </div>
        </main>
      </WithNavBar>
    </>
  );
};

export default Recipes;
