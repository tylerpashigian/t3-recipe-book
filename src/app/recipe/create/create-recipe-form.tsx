"use client";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { useRecipe } from "~/hooks/data/recipe";
import RecipeForm from "~/components/recipe/recipe-form";
import WithNavBar from "~/components/UI/with-nabvar";
import { type RecipeFormModel } from "~/models/recipe";

export default function CreateRecipeForm({ userId }: { userId: string }) {
  const router = useRouter();
  const { create, isLoading, categories, allIngredients } = useRecipe();

  const createHandler = async (recipeToCreate?: RecipeFormModel) => {
    if (!recipeToCreate?.name || !userId) return;

    const createRecipe = create(
      recipeToCreate,
      userId,
      (newRecipe) =>
        newRecipe.recipe.id && router.push(`/recipe/${newRecipe.recipe.id}`),
    );

    await toast.promise(createRecipe, {
      error: "Failed to create",
      loading: "Creating recipe",
      success: "Recipe created",
    });
  };

  return (
    <>
      <WithNavBar classes="bg-forked-neutral">
        <main className="mx-auto flex w-full max-w-6xl flex-col px-4 py-8 sm:px-6 md:py-12">
          <RecipeForm
            allIngredients={allIngredients}
            categories={categories}
            onSubmit={createHandler}
            isLoading={isLoading}
          />
        </main>
      </WithNavBar>
    </>
  );
}
