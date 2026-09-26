import Link from "next/link";

import { Button } from "~/components/UI/button";
import type { RecipeSummary } from "~/models/recipe";
import { RecipeCard, Skeleton } from "./recipe-card";

interface Props {
  isLoading: boolean;
  recipes: RecipeSummary[];
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

const RecipeTable = ({
  isLoading,
  recipes,
  hasActiveFilters = false,
  onClearFilters,
}: Props) => {
  return isLoading ? (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} />
      ))}
    </div>
  ) : recipes.length > 0 ? (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={`${recipe.id}`} recipe={recipe} />
      ))}
    </div>
  ) : (
    <div className="min-h-72 flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-forked-background px-6 text-center">
      <p className="font-display text-2xl text-foreground">
        Nothing matches yet.
      </p>
      <p className="mt-2 max-w-md text-forked-secondary-foreground">
        Try a broader search or a different category to see more of your
        collection.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {hasActiveFilters ? (
          <Button onClick={onClearFilters}>Clear filters</Button>
        ) : null}
        <Button
          asChild
          variant={hasActiveFilters ? "primary-outline" : "default"}
        >
          <Link href="/recipe/build">Build from ingredients</Link>
        </Button>
      </div>
    </div>
  );
};

export default RecipeTable;
