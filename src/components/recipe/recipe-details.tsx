import React, { useState } from "react";
import Link from "next/link";

import { useSession } from "next-auth/react";
import { Calculator, Clock, Users } from "lucide-react";

import LikeButton from "~/components/UI/like-button";
import Separator from "~/components/UI/separator";
import { Button } from "~/components/UI/button";
import { Badge } from "~/components/UI/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/UI/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/UI/card";
import { type Recipe, type Author } from "~/models/recipe";
import { formatFraction } from "~/utils/conversions";
import { toFirstLetterUppercase } from "~/utils/string";

const ingredientStopWords = new Set([
  "a",
  "an",
  "and",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

const tokenizeIngredientName = (value: string) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter(
      (token) => token && token.length >= 2 && !ingredientStopWords.has(token),
    );

const formatIngredientQuantity = (
  ingredient: { quantity: number | null; unit: string | null },
  scalingOption: number,
) => {
  if (ingredient.quantity === null || ingredient.quantity === undefined) {
    return "Quantity not listed";
  }

  const quantity = formatFraction(ingredient.quantity * scalingOption);
  return ingredient.unit ? `${quantity} ${ingredient.unit}` : quantity;
};

export enum DetailsPageType {
  Details,
  Edit,
}

type IngredientMatchEntry = {
  name: string;
  quantity: number | null;
  unit: string | null;
  normalizedName: string;
};

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

  const hasNutritionInfo =
    recipe.calories ?? recipe.protein ?? recipe.carbs ?? recipe.fat;

  const scalingOptions = [0.5, 1, 2];

  const [selectedScalingOption, setSelectedScalingOption] = useState(1);

  const { ingredientPhraseLookup, ingredientTokenLookup, maxPhraseTokens } =
    React.useMemo(() => {
      const phraseLookup = new Map<string, IngredientMatchEntry[]>();
      const tokenLookup = new Map<string, IngredientMatchEntry[]>();
      let maxTokens = 1;

      const addLookupEntry = (
        map: Map<string, IngredientMatchEntry[]>,
        key: string,
        entry: IngredientMatchEntry,
      ) => {
        const existing = map.get(key);
        if (existing) {
          if (
            !existing.some(
              (item) => item.name.toLowerCase() === entry.name.toLowerCase(),
            )
          ) {
            existing.push(entry);
          }
        } else {
          map.set(key, [entry]);
        }
      };

      recipe.ingredients.forEach((ingredient) => {
        const name = ingredient.name.trim();
        if (!name) {
          return;
        }

        const tokens = tokenizeIngredientName(name);
        if (!tokens.length) {
          return;
        }

        const ingredientEntry = {
          name,
          quantity: ingredient.quantity ?? null,
          unit: ingredient.unit ?? null,
          normalizedName: tokens.join(" "),
        };

        maxTokens = Math.max(maxTokens, tokens.length);

        tokens.forEach((token) =>
          addLookupEntry(tokenLookup, token, ingredientEntry),
        );

        for (let start = 0; start < tokens.length; start += 1) {
          for (let end = start + 2; end <= tokens.length; end += 1) {
            addLookupEntry(
              phraseLookup,
              tokens.slice(start, end).join(" "),
              ingredientEntry,
            );
          }
        }
      });

      return {
        ingredientPhraseLookup: phraseLookup,
        ingredientTokenLookup: tokenLookup,
        maxPhraseTokens: maxTokens,
      };
    }, [recipe.ingredients]);

  const renderInstructionContent = (content: string) => {
    if (!ingredientPhraseLookup.size && !ingredientTokenLookup.size) {
      return content;
    }

    const parts: React.ReactNode[] = [];
    const wordRegex = /[A-Za-z0-9']+/g;
    const matches = Array.from(content.matchAll(wordRegex)).map((match) => ({
      text: match[0],
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length,
      token: match[0].toLowerCase(),
    }));

    if (!matches.length) {
      return content;
    }

    let lastIndex = 0;
    let index = 0;

    while (index < matches.length) {
      const current = matches[index];
      const startIndex = current?.start ?? 0;

      if (startIndex > lastIndex) {
        parts.push(content.slice(lastIndex, startIndex));
      }

      let matchedIngredients: IngredientMatchEntry[] | undefined;
      let matchedLength = 0;

      const maxLength = Math.min(maxPhraseTokens, matches.length - index);

      for (let length = maxLength; length >= 2; length -= 1) {
        const phrase = matches
          .slice(index, index + length)
          .map((match) => match.token)
          .join(" ");
        const phraseMatch = ingredientPhraseLookup.get(phrase);
        if (phraseMatch) {
          const explicitMatches = phraseMatch.filter(
            (ingredient) => ingredient.normalizedName === phrase,
          );
          matchedIngredients = explicitMatches.length
            ? explicitMatches
            : phraseMatch;
          matchedLength = length;
          break;
        }
      }

      if (!matchedIngredients && current) {
        const tokenMatch = ingredientTokenLookup.get(current.token);
        if (!tokenMatch) {
          parts.push(current.text);
          lastIndex = current.end;
          index += 1;
          continue;
        }
        matchedIngredients = tokenMatch;
        matchedLength = 1;
      }

      const endIndex = matches[index + matchedLength - 1]?.end;
      const matchedText = content.slice(startIndex, endIndex);

      const hasMultipleMatches = (matchedIngredients?.length ?? 0) > 1;
      const tooltipText = matchedIngredients?.length
        ? matchedIngredients
            .map((ingredient) => {
              const quantityText = formatIngredientQuantity(
                ingredient,
                selectedScalingOption,
              );
              if (hasMultipleMatches) {
                return `${toFirstLetterUppercase(
                  ingredient.name,
                )}: ${quantityText}`;
              }
              return quantityText;
            })
            .join("\n")
        : [];

      parts.push(
        <Tooltip key={`${startIndex}-${matchedText}`} delayDuration={0}>
          <TooltipTrigger asChild>
            <span className="rounded bg-secondary-foreground/10 p-[2px]">
              {matchedText}
            </span>
          </TooltipTrigger>
          <TooltipContent>{tooltipText}</TooltipContent>
        </Tooltip>,
      );

      lastIndex = endIndex ?? matchedIngredients?.length ?? 0;
      index += matchedLength;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
  };

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
              {!!sessionData && sessionData?.user.id === author?.id ? (
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
                    {recipe.servings * selectedScalingOption} servings
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}

          {hasNutritionInfo ? (
            <div className="grid grid-cols-2 gap-4 md:flex md:flex-wrap">
              {recipe.calories ? (
                <p className="text-sm font-medium text-forked-secondary-foreground">
                  Calories: {recipe.calories} (kcal)
                </p>
              ) : null}
              {recipe.protein ? (
                <p className="text-sm font-medium text-forked-secondary-foreground">
                  Protein: {recipe.protein} (g)
                </p>
              ) : null}
              {recipe.carbs ? (
                <p className="text-sm font-medium text-forked-secondary-foreground">
                  Carbs: {recipe.carbs} (g)
                </p>
              ) : null}
              {recipe.fat ? (
                <p className="text-sm font-medium text-forked-secondary-foreground">
                  Fat: {recipe.fat} (g)
                </p>
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

      <Card className="border border-border bg-forked-background">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator />
            <CardTitle className="text-xl text-foreground">
              Recipe Scaling
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-forked-secondary-foreground">Scale:</span>
            {scalingOptions.map((option) => (
              <Button
                key={option}
                onClick={() => setSelectedScalingOption(option)}
                variant={
                  option === selectedScalingOption ? "default" : "outline"
                }
              >
                {formatFraction(option)}x
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

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
                        ? `(${formatFraction(
                            ingredient.quantity * selectedScalingOption,
                          )} ${ingredient.unit})`
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
                      {renderInstructionContent(instruction.content)}
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
