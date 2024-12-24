import { useForm } from "@tanstack/react-form";
import React from "react";
import { api } from "~/utils/api";
import { Button } from "~/components/UI/button";
import { Combobox, type OptionType } from "~/components/UI/combobox";
import WithNavBar from "~/components/UI/with-nabvar";
import { toFirstLetterUppercase } from "~/utils/string";
import Link from "next/link";

const BuildRecipe = () => {
  const form = useForm<{ selectedIngredients: OptionType[] }>({
    defaultValues: {
      selectedIngredients: [],
    },
  });

  const { data: allIngredients } = api.recipes.getIngredients.useQuery({
    name: "",
  });

  const selectedIngredients = form.useStore(
    (state) => state.values.selectedIngredients,
  );

  const { data, isLoading } = api.recipes.getAll.useQuery({
    query: "",
    ingredients: selectedIngredients?.map((ingredient) => ingredient.value),
  });

  return (
    <WithNavBar>
      <main className="flex flex-col">
        <div className="container flex flex-col items-center justify-center gap-4 py-8 md:py-16">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Build a Recipe</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Enter the ingredients you have at home and let us find a recipe
              for you
            </p>
          </div>
          <div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              className="bg-white"
            >
              <div className="space-y-4">
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
              </div>
            </form>
            <div className="flex flex-col items-center gap-2">
              {!isLoading && selectedIngredients.length && data?.length
                ? data.map((recipe) => (
                    <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
                      <Button variant={"link"}>{recipe.name}</Button>
                    </Link>
                  ))
                : null}
            </div>
          </div>
        </div>
      </main>
    </WithNavBar>
  );
};

export default BuildRecipe;
