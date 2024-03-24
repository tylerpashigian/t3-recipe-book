import React, { useState } from "react";
import { api } from "~/utils/api";
import Button from "./UI/button";
import RecipeForm, { RecipeFormType } from "./recipe-form";
import { type Recipe } from "~/models/recipe";
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
  const { data, isLoading, refetch } = api.recipes.getDetails.useQuery({
    id: id,
  });

  const recipe: Recipe | undefined | null = data?.recipe;

  const pageTypeHandler = () => {
    setPageType((prevType) =>
      prevType === DetailsPageType.Details
        ? DetailsPageType.Edit
        : DetailsPageType.Details,
    );
  };

  const onUpdate = async (_recipe?: Partial<Recipe>) => {
    // TODO: update local copy of recipe
    await refetch();
    // const key = getQueryKey(api.recipes.getDetails, undefined, "query");
    // queryClient.setQueryData(key, (oldData) => recipe);
    setPageType(DetailsPageType.Details);
  };

  return (
    <>
      {isLoading && <h3>Loading...</h3>}
      {recipe && !isLoading && (
        <>
          {pageType === DetailsPageType.Details && (
            <div className="container mx-auto flex w-full flex-col space-y-2">
              <div className="flex">
                <h3 className="w-full px-4 py-3 text-black">{recipe.name}</h3>
                <Button onClickHandler={pageTypeHandler}>
                  <>Edit</>
                </Button>
              </div>
              {recipe.description ? (
                <div>
                  <p>Recipe Description</p>
                  <p className="mt-2 w-full px-4 py-3 text-black">
                    {recipe.description}
                  </p>
                </div>
              ) : null}
              {recipe.instructions ? (
                <div>
                  <p>Instructions</p>
                  <p className="mt-2 w-full px-4 py-3 text-black">
                    {recipe.instructions}
                  </p>
                </div>
              ) : null}
              {recipe.ingredients.length
                ? recipe.ingredients.map((ingredient) => {
                    return (
                      <li key={ingredient.ingredientId}>
                        {ingredient.name} ({ingredient.quantity}{" "}
                        {ingredient.unit})
                      </li>
                    );
                  })
                : null}
            </div>
          )}
          {pageType === DetailsPageType.Edit && (
            <RecipeForm
              recipe={recipe}
              onSubmit={(recipe) => void onUpdate(recipe)}
              formType={RecipeFormType.Edit}
            />
          )}
        </>
      )}
    </>
  );
};

export default RecipeDetails;