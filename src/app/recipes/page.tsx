"use client";

import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import { Search, X } from "lucide-react";

import { useRecipes } from "~/hooks/data/recipes";
import { useRecipe } from "~/hooks/data/recipe";
import WithNavBar from "~/components/UI/with-nabvar";
import { Input } from "~/components/UI/input";
import { Combobox, type OptionType } from "~/components/UI/combobox";
import { categoryToOption } from "~/models/mappings/recipe";
import RecipeTable from "~/components/recipe/recipe-table";
import { Button } from "~/components/UI/button";

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
  const hasActiveFilters =
    query.trim().length > 0 || selectedCategories.length > 0;
  const clearFilters = () => {
    setQuery("");
    setSelectedCategories([]);
  };
  const resultLabel = isLoading
    ? "Updating your collection"
    : `${recipes.length} ${recipes.length === 1 ? "recipe" : "recipes"}`;

  return (
    <>
      <Head>
        <title>Recipes</title>
        <meta name="Search all recipes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WithNavBar classes="bg-forked-neutral">
        <main className="flex w-full flex-col">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-12">
            <div className="mb-8 flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-forked-accent">
                  Your recipe desk
                </p>
                <h1 className="text-headline text-foreground">My recipes</h1>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-forked-secondary-foreground sm:text-lg">
                  A calm, ad-free collection for the recipes you return to.
                </p>
              </div>
              <Button asChild className="min-h-11 w-full sm:w-auto">
                <Link href="/recipe/create">Add a recipe</Link>
              </Button>
            </div>

            <div className="mb-6 rounded-lg border border-border bg-forked-background p-3 sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    placeholder="Search your collection"
                    className="min-h-11 pl-10"
                    onChange={(query) => setQuery(query.target.value)}
                    value={query}
                  />
                </div>
                <Combobox
                  className="w-full sm:w-56"
                  options={[...(categories ?? []).map(categoryToOption)]}
                  selected={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder="Filter by category"
                />
              </div>
              <div className="min-h-7 flex items-center justify-between gap-3 pt-1 text-sm">
                <p className="text-forked-secondary-foreground">
                  {resultLabel}
                </p>
                {hasActiveFilters ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto gap-1 px-1 text-forked-primary"
                    onClick={clearFilters}
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear filters
                  </Button>
                ) : null}
              </div>
            </div>

            <RecipeTable
              isLoading={isLoading}
              recipes={recipes}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
            />
          </div>
        </main>
      </WithNavBar>
    </>
  );
};

export default Recipes;
