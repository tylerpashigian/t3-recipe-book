"use client";

import { Clock, Users } from "lucide-react";
import { IoHeart } from "react-icons/io5";

import { Badge } from "~/components/UI/badge";
import { Combobox, type OptionType } from "~/components/UI/combobox";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/UI/card";
import type { RecipeSummary } from "~/models/recipe";

const previewIngredients: OptionType[] = [
  { value: "tomatoes", label: "Tomatoes" },
  { value: "pasta", label: "Pasta" },
  { value: "garlic", label: "Garlic" },
];

const previewRecipes: RecipeSummary[] = [
  {
    id: "preview-pasta",
    name: "Garlic tomato pasta",
    description: "A quick pantry pasta for weeknights.",
    categories: [{ id: "dinner", name: "Dinner" }],
    cookTime: 25,
    servings: 2,
    favoriteCount: 8,
  },
  {
    id: "preview-soup",
    name: "Tomato basil soup",
    description: "Comforting, simple, and ready in one pot.",
    categories: [{ id: "lunch", name: "Lunch" }],
    cookTime: 35,
    servings: 4,
    favoriteCount: 5,
  },
];

const PreviewRecipeCard = ({ recipe }: { recipe: RecipeSummary }) => {
  const totalTime = +(recipe.prepTime ?? 0) + +(recipe.cookTime ?? 0);

  return (
    <Card className="flex h-full flex-col border-border bg-forked-background shadow-sm">
      <CardHeader className="space-y-2 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg leading-tight text-foreground sm:text-xl">
            {recipe.name}
          </CardTitle>
          <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-foreground">
            <IoHeart className="h-4 w-4 fill-current text-forked-accent" />
            {recipe.favoriteCount}
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-forked-secondary-foreground">
          {recipe.description}
        </p>
      </CardHeader>
      <CardContent className="mt-auto p-4 pt-0 sm:p-5 sm:pt-0">
        <div className="mb-3 flex flex-wrap gap-2">
          {recipe.categories.map((category) => (
            <Badge key={category.id} variant="subtle">
              {category.name}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-forked-secondary-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {totalTime} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {recipe.servings}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const LandingBuilderPreview = () => {
  return (
    <section
      aria-label="Recipe builder preview"
      className="mx-auto w-full max-w-5xl rounded-xl border border-border bg-forked-background p-4 shadow-[0_16px_34px_rgb(53_65_54_/_0.12)] sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-foreground sm:text-lg">
          What is in your kitchen?
        </h2>
        <span className="text-sm font-medium text-forked-accent">Clear</span>
      </div>
      <Combobox
        disabled
        options={previewIngredients}
        selected={previewIngredients}
        onChange={() => undefined}
        placeholder="Select an ingredient"
        className="pointer-events-none"
      />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {previewRecipes.map((recipe) => (
          <PreviewRecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
};

export default LandingBuilderPreview;
