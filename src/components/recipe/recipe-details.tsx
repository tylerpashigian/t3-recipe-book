import React from "react";
import Link from "next/link";

import { useSession } from "next-auth/react";
import { Clock, Users } from "lucide-react";

import LikeButton from "~/components/UI/like-button";
import Separator from "~/components/UI/separator";
import { Button } from "~/components/UI/button";
import { Badge } from "~/components/UI/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/UI/card";
import { type Recipe, type Author } from "~/models/recipe";
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

  const hasMetadata = recipe.prepTime ?? recipe.cookTime ?? recipe.servings;

  return (
    <div className="mx-auto w-full space-y-8 p-4 md:p-6">
      <div className="flex w-full items-start justify-between">
        <div className="w-full space-y-4">
          <div className="flex w-full items-center gap-3">
            <div className="flex w-full justify-between">
              <div className="flex flex-col gap-4 md:flex-row">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {recipe.name}
                </h1>
                <div className="flex items-center gap-3">
                  {!!sessionData && author && (
                    <LikeButton
                      isInitiallyLiked={recipe.isFavorited}
                      onClick={(favorited: boolean) =>
                        void onFavorite(favorited)
                      }
                    />
                  )}
                  <span>{recipe.favoriteCount} Favorites(s)</span>
                </div>
              </div>
              {sessionData?.user.id === author?.id ? (
                <div className="flex gap-2">
                  <Button onClick={pageTypeHandler}>Edit</Button>
                  <Button
                    variant={"destructive"}
                    onClick={() => void onDelete()}
                  >
                    Delete
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {recipe.categories.map((category, index) => {
              return (
                <Badge key={category.id} variant="accent">
                  {category.name}
                </Badge>
              );
            })}
          </div>

          {hasMetadata ? (
            <div className="flex flex-wrap gap-4">
              {recipe.prepTime ? (
                <div className="flex items-center gap-2 text-forked-secondary-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Prep: {recipe.prepTime} min
                  </span>
                </div>
              ) : null}
              {recipe.cookTime ? (
                <div className="flex items-center gap-2 text-forked-secondary-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Cook: {recipe.cookTime} min
                  </span>
                </div>
              ) : null}
              {recipe.servings ? (
                <div className="flex items-center gap-2 text-forked-secondary-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {recipe.servings} servings
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}
          {recipe.description ? (
            <p className="max-w-3xl text-lg leading-relaxed text-forked-secondary-foreground">
              {recipe.description}
            </p>
          ) : null}
        </div>
      </div>

      <Separator />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="border border-border bg-forked-background">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                Ingredients
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recipe.ingredients.length ? (
                <ul className="list-inside list-disc space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="items-start gap-3 text-sm leading-relaxed text-forked-secondary-foreground"
                    >
                      {toFirstLetterUppercase(ingredient.name)}{" "}
                      {ingredient.quantity
                        ? `(${formatFraction(ingredient.quantity)} ${
                            ingredient.unit
                          })`
                        : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-forked-secondary-foreground">
                  No ingredients listed.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border border-border bg-forked-background">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recipe.steps.length ? (
                <ol className="list-inside list-decimal space-y-6">
                  {recipe.steps.map((instruction, index) => (
                    <li
                      key={index}
                      className="gap-4 text-sm leading-relaxed text-forked-secondary-foreground"
                    >
                      {instruction.content}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-forked-secondary-foreground">
                  No steps listed.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {author && displayName && (
        <p>
          Author:
          <span>
            <Button className="px-2" variant={"link"} asChild>
              <Link href={`/user/${author.id}`}>{displayName}</Link>
            </Button>
          </span>
        </p>
      )}
    </div>
  );
};

export default RecipeDetails;
