import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Button from "./UI/button";
import RecipeForm from "./recipe-form";
import { type Recipe } from "~/models/recipe";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
// import { getQueryKey } from "@trpc/react-query";

export enum DetailsPageType {
  Details,
  Edit,
}

type Props = {
  id: string;
};

const RecipeDetails = ({ id }: Props) => {
  const [pageType, setPageType] = useState(DetailsPageType.Details);

  const { data: sessionData } = useSession();
  const router = useRouter();

  const { data, isLoading, refetch } = api.recipes.getDetails.useQuery({
    id: id,
  });
  const { isLoading: isUpdating, mutateAsync: updateRecipe } =
    api.recipes.update.useMutation({});
  const { mutateAsync: deleteRecipe } = api.recipes.delete.useMutation({});

  const recipe: Recipe | undefined | null = data?.recipe;

  const pageTypeHandler = () => {
    setPageType((prevType) =>
      prevType === DetailsPageType.Details
        ? DetailsPageType.Edit
        : DetailsPageType.Details,
    );
  };

  const onUpdate = async (recipeToUpdate?: Partial<Recipe>) => {
    if (
      !recipeToUpdate?.id ||
      !recipeToUpdate?.name ||
      !recipeToUpdate?.authorId
    ) {
      setPageType(DetailsPageType.Details);
      return;
    }

    const cleanedRecipe = {
      ...recipeToUpdate,
      id: recipeToUpdate.id,
      name: recipeToUpdate.name,
      authorId: recipeToUpdate.authorId,
    };

    const update = updateRecipe(cleanedRecipe, {
      async onSuccess() {
        // TODO: update local copy of recipe
        await refetch();
        // const key = getQueryKey(api.recipes.getDetails, undefined, "query");
        // queryClient.setQueryData(key, (oldData) => recipe);
        setPageType(DetailsPageType.Details);
      },
    });

    await toast.promise(update, {
      error: "Failed to update",
      loading: "Updating recipe",
      success: "Updated recipe",
    });
  };

  const cancelHandler = () => {
    setPageType(DetailsPageType.Details);
  };

  const deleteHandler = async () => {
    if (!data?.recipe?.id || !data.author.id) {
      toast.error("Invalid recipe");
      return;
    }
    const asyncDelete = deleteRecipe(
      { id: data.recipe.id, authorId: data.author.id },
      {
        async onSuccess() {
          await router.push("/");
        },
      },
    );

    await toast.promise(asyncDelete, {
      error: "Failed to delete",
      loading: "Deleting recipe",
      success: "Deleted recipe",
    });
  };

  return (
    <>
      {isLoading && <h3>Loading...</h3>}
      {recipe && !isLoading && (
        <>
          {pageType === DetailsPageType.Details && (
            <div className="container mx-auto flex w-full flex-col space-y-2">
              <div className="mb-4 grid grid-cols-1 content-between items-center md:grid-cols-2">
                <h3 className="w-full items-center py-3 text-lg font-bold text-black">
                  {recipe.name}
                </h3>
                {sessionData?.user.id === recipe.authorId && (
                  <div className="grid w-full grid-cols-2 justify-center gap-2 md:flex md:w-auto md:justify-end">
                    <Button onClickHandler={pageTypeHandler}>
                      <>Edit</>
                    </Button>
                    <Button onClickHandler={() => void deleteHandler()}>
                      <>Delete</>
                    </Button>
                  </div>
                )}
              </div>
              {recipe.description ? (
                <div>
                  <p className="mb-2 font-semibold">Recipe Description</p>
                  <p className="w-full text-black">{recipe.description}</p>
                </div>
              ) : null}
              {recipe.instructions ? (
                <div>
                  <p className="mb-2 font-semibold">Instructions</p>
                  <p className="w-full whitespace-pre-line text-black">
                    {recipe.instructions}
                  </p>
                </div>
              ) : null}
              {recipe.ingredients.length ? (
                <div>
                  <p className="mb-2 font-semibold">Ingredients</p>
                  {recipe.ingredients.map((ingredient) => {
                    return (
                      <li key={ingredient.ingredientId}>
                        {ingredient.name} {ingredient.quantity ? `(${ingredient.quantity} ${ingredient.unit})` : null}
                      </li>
                    );
                  })}
                </div>
              ) : null}
            </div>
          )}
          {pageType === DetailsPageType.Edit && (
            <RecipeForm
              recipe={recipe}
              isLoading={isLoading || isUpdating}
              onSubmit={(recipe) => onUpdate(recipe)}
              onCancel={cancelHandler}
            />
          )}
        </>
      )}
    </>
  );
};

export default RecipeDetails;
