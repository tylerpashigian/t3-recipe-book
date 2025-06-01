"use client";

import React from "react";

import Head from "next/head";
import { useForm } from "@tanstack/react-form";

import { Combobox, type OptionType } from "~/components/UI/combobox";
import WithNavBar from "~/components/UI/with-nabvar";
import RecipeTable from "~/components/recipe/recipe-table";
import { toFirstLetterUppercase } from "~/utils/string";
import { useRecipes } from "~/hooks/data/recipes";
import { useRecipe } from "~/hooks/data/recipe";

const BuildRecipe = () => {
  const form = useForm<{ selectedIngredients: OptionType[] }>({
    defaultValues: {
      selectedIngredients: [],
    },
  });

  const selectedIngredients = form.useStore(
    (state) => state.values.selectedIngredients,
  );

  const { allIngredients } = useRecipe();
  const { recipes, isLoading: isRecipesLoading } = useRecipes({
    query: "",
    ingredients: selectedIngredients?.map((ingredient) => ingredient.value),
  });

  return (
    <>
      <Head>
        <title>Build Recipes</title>
        <meta name="Building recipes from your ingredients" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WithNavBar classes="bg-forked-neutral">
        <main className="flex w-full flex-col">
          <div className="mx-auto w-full max-w-6xl px-6 py-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-foreground">
                  Possible Recipes
                </h1>
                <p className="text-forked-secondary-foreground">
                  Enter the ingredients you have at home and let us find a
                  recipe for you{" "}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                <form.Field name="selectedIngredients">
                  {(field) => (
                    <>
                      <label className="font-bold">Recipe Ingredients</label>
                      <Combobox
                        isMultiSelect={true}
                        className="mt-2"
                        options={(allIngredients ?? []).map((ingredient) => ({
                          label: toFirstLetterUppercase(ingredient.name),
                          value: ingredient.name,
                        }))}
                        selected={field.state.value}
                        onChange={field.handleChange}
                        placeholder="Select an Ingredient..."
                      />
                    </>
                  )}
                </form.Field>
              </form>

              <RecipeTable isLoading={isRecipesLoading} recipes={recipes} />
            </div>
          </div>
        </main>
      </WithNavBar>
    </>
  );
};

export default BuildRecipe;
