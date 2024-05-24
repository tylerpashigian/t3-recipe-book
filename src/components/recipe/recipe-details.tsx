import React from "react";

import { useSession } from "next-auth/react";

import { type Recipe } from "~/models/recipe";
import { Button } from "../UI/button";
import LikeButton from "~/components/UI/like-button";
// import { getQueryKey } from "@trpc/react-query";

export enum DetailsPageType {
  Details,
  Edit,
}

type Props = {
  recipe: Recipe;
  pageTypeHandler: () => void;
  onDelete: () => Promise<void>;
  onFavorite: (favorited: boolean) => Promise<void>;
};

const RecipeDetails = ({
  recipe,
  pageTypeHandler,
  onDelete,
  onFavorite,
}: Props) => {
  const { data: sessionData } = useSession();

  return (
    <div className="mx-auto flex w-full flex-col space-y-2">
      <div className="mb-4 grid grid-cols-1 content-between items-center gap-4 md:grid-cols-2 lg:py-3">
        <div className="flex w-full flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-3">
          <h3 className="text-lg font-bold text-black">{recipe.name}</h3>
          <div className="flex items-center gap-3">
            {!!sessionData && (
              <LikeButton
                isInitiallyLiked={recipe.isFavorited}
                onClick={(favorited: boolean) => void onFavorite(favorited)}
              />
            )}
            <span>{recipe.favoriteCount} Favorites(s)</span>
          </div>
        </div>
        {sessionData?.user.id === recipe.authorId && (
          <div className="grid w-full grid-cols-2 justify-center gap-2 md:flex md:w-auto md:justify-end">
            <Button onClick={pageTypeHandler}>
              <>Edit</>
            </Button>
            <Button onClick={() => void onDelete()}>
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
                {ingredient.name}{" "}
                {ingredient.quantity ? `(${ingredient.quantity})` : null}
              </li>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default RecipeDetails;
