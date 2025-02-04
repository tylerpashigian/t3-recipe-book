import React from "react";
import Link from "next/link";

import { useSession } from "next-auth/react";

import { type Recipe, type Author } from "~/models/recipe";
import { Button } from "../UI/button";
import LikeButton from "~/components/UI/like-button";
import { formatFraction } from "~/utils/conversions";
import { toFirstLetterUppercase } from "~/utils/string";

export enum DetailsPageType {
  Details,
  Edit,
}

type Props = {
  recipe: Recipe;
  author?: Author;
  pageTypeHandler: () => void;
  onDelete: () => Promise<void>;
  onFavorite: (favorited: boolean) => Promise<void>;
};

const RecipeDetails = ({
  recipe,
  author,
  pageTypeHandler,
  onDelete,
  onFavorite,
}: Props) => {
  const { data: sessionData } = useSession();

  const displayName = author?.name ?? author?.username;

  return (
    <div className="mx-auto flex w-full flex-col space-y-2">
      <div className="mb-4 grid grid-cols-1 content-between items-center gap-4 md:grid-cols-2 lg:py-3">
        <div className="flex w-full flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-3">
          <h3 className="text-lg font-bold text-black">{recipe.name}</h3>
          <div className="flex items-center gap-3">
            {!!sessionData && author && (
              <LikeButton
                isInitiallyLiked={recipe.isFavorited}
                onClick={(favorited: boolean) => void onFavorite(favorited)}
              />
            )}
            <span>{recipe.favoriteCount} Favorites(s)</span>
          </div>
        </div>
        {sessionData?.user.id === author?.id && (
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
      {recipe.steps ? (
        <div>
          <p className="mb-2 font-semibold">Instructions</p>
          <ol className="list-inside list-decimal">
            {recipe.steps.map((step) => (
              <li key={step.order}>{step.content}</li>
            ))}
          </ol>
        </div>
      ) : null}
      {recipe.ingredients.length ? (
        <div>
          <p className="mb-2 font-semibold">Ingredients</p>
          <ul className="list-inside list-disc">
            {recipe.ingredients.map((ingredient) => {
              return (
                <li key={ingredient.id} className="flex">
                  {toFirstLetterUppercase(ingredient.name)}{" "}
                  {ingredient.quantity
                    ? `(${formatFraction(ingredient.quantity)} ${
                        ingredient.unit
                      })`
                    : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      {author && displayName && (
        <p>
          Author:
          <span>
            <Button className="px-2" variant={"link"} asChild>
              <Link href={`/profile/${author.id}`}>{displayName}</Link>
            </Button>
          </span>
        </p>
      )}
    </div>
  );
};

export default RecipeDetails;
