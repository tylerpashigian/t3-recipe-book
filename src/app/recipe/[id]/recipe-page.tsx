"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import RecipeDetails, {
  DetailsPageType,
} from "~/components/recipe/recipe-details";
import RecipeForm from "~/components/recipe/recipe-form";
import { type FullRecipe, type RecipeFormModel } from "~/models/recipe";
import { useRecipe } from "~/hooks/data/recipe";
import { revalidateRecipePath } from "~/app/actions/recipe";
import WithNavBar from "~/components/UI/with-nabvar";

export default function RecipePage({
  initialRecipe,
}: {
  initialRecipe: FullRecipe;
}) {
  const router = useRouter();
  const [pageType, setPageType] = useState(DetailsPageType.Details);

  const {
    recipe: clientRecipe,
    isLoading,
    update,
    delete: deleteRecipe,
    favorite,
    categories,
    allIngredients,
  } = useRecipe(initialRecipe?.recipe?.id);

  const recipe = clientRecipe ?? initialRecipe;

  const pageTypeHandler = () => {
    setPageType((prevType) =>
      prevType === DetailsPageType.Details
        ? DetailsPageType.Edit
        : DetailsPageType.Details,
    );
  };

  const onUpdate = async (recipeToUpdate: RecipeFormModel) => {
    if (!recipeToUpdate?.id || !recipeToUpdate?.name || !recipe?.author.id) {
      setPageType(DetailsPageType.Details);
      return;
    }

    const updateRecipe = update(recipeToUpdate, recipe.author.id, () => {
      setPageType(DetailsPageType.Details);
      window.scrollTo({ top: 0 });
    });

    await toast.promise(updateRecipe, {
      error: "Failed to update",
      loading: "Updating recipe",
      success: "Updated recipe",
    });

    await revalidateRecipePath(recipeToUpdate.id);
  };

  const cancelHandler = () => setPageType(DetailsPageType.Details);

  const favoriteHandler = async (favorited: boolean) => {
    if (!recipe) return;

    await toast.promise(
      favorite(recipe.recipe.id, recipe.author.id, favorited),
      {
        error: "Failed to update",
        loading: "Updating recipe",
        success: "Updated recipe",
      },
    );

    await revalidateRecipePath(recipe.recipe.id);
  };

  const deleteHandler = async () => {
    if (!recipe?.recipe?.id || !recipe?.author?.id) {
      toast.error("Invalid recipe");
      return;
    }

    await toast.promise(
      deleteRecipe(recipe.recipe.id, recipe.author.id, () => {
        router.push("/");
      }),
      {
        error: "Failed to delete",
        loading: "Deleting recipe",
        success: "Deleted recipe",
      },
    );
  };

  return (
    <WithNavBar classes="bg-forked-neutral">
      <main className="flex w-full flex-col">
        <div className="mx-auto w-full max-w-6xl p-4 md:px-6 md:py-8">
          <div className="flex w-full flex-col items-center gap-2">
            {recipe && (
              <>
                {pageType === DetailsPageType.Details && (
                  <RecipeDetails
                    author={recipe.author}
                    recipe={recipe.recipe}
                    pageTypeHandler={pageTypeHandler}
                    onDelete={deleteHandler}
                    onFavorite={favoriteHandler}
                  />
                )}
                {pageType === DetailsPageType.Edit && (
                  <RecipeForm
                    allIngredients={allIngredients}
                    categories={categories}
                    recipe={recipe.recipe}
                    isLoading={isLoading}
                    onSubmit={onUpdate}
                    onCancel={cancelHandler}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </WithNavBar>
  );
}
