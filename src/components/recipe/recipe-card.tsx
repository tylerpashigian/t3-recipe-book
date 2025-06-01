import React from "react";

import Link from "next/link";
import { IoHeart } from "react-icons/io5";
import { Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/UI/card";
import { RecipeSummary } from "~/models/recipe";

import { Button } from "~/components/UI/button";
import { Badge } from "~/components/UI/badge";

export const RecipeCard = ({ recipe }: { recipe: RecipeSummary }) => {
  const totalTime = +(recipe.prepTime ?? 0) + +(recipe.cookTime ?? 0);
  return (
    <Card
      key={recipe.id}
      className="bg-forked-background group flex h-full flex-col justify-between border border-border transition-shadow hover:shadow-lg"
    >
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-start justify-between">
          <CardTitle className="line-clamp-2 flex-1 text-lg text-foreground">
            {recipe.name}
          </CardTitle>
          <div className="ml-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <IoHeart className={"h-4 w-4 fill-current text-red-500"} />
              <span className="text-sm font-medium text-foreground">
                {recipe.favoriteCount}
              </span>
            </div>
          </div>
        </div>
        <p className="text-forked-secondary-foreground line-clamp-3 text-sm">
          {recipe.description}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {recipe.categories.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {recipe.categories.map((category) => (
              <Badge key={category.name} variant="subtle">
                {category.name}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="text-forked-secondary-foreground mb-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {totalTime > 0 ? (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{totalTime} min</span>
              </div>
            ) : null}
            {recipe.servings ?? 0 > 0 ? (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings}</span>
              </div>
            ) : null}
          </div>
        </div>

        <Button asChild className="w-full">
          <Link href={`/recipe/${recipe.id}`}>View Recipe</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export const Skeleton = () => {
  return (
    <Card className="bg-forked-background animate-pulse border border-border">
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-start justify-between">
          <div className="h-6 w-3/4 rounded bg-border"></div>
          <div className="h-6 w-16 rounded bg-border"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-border"></div>
          <div className="h-4 w-2/3 rounded bg-border"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4 flex gap-2">
          <div className="h-5 w-16 rounded bg-border"></div>
          <div className="h-5 w-20 rounded bg-border"></div>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-4">
            <div className="h-4 w-16 rounded bg-border"></div>
            <div className="h-4 w-12 rounded bg-border"></div>
          </div>
          <div className="h-4 w-20 rounded bg-border"></div>
        </div>
        <div className="h-9 w-full rounded bg-border"></div>
      </CardContent>
    </Card>
  );
};
