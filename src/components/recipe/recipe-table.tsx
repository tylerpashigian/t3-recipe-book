import { RecipeSummary } from "~/models/recipe";
import { RecipeCard, Skeleton } from "./recipe-card";

interface Props {
  isLoading: boolean;
  recipes: RecipeSummary[];
}

const RecipeTable = ({ isLoading, recipes }: Props) => {
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
    // TODO: Add empty state component
    <div className="flex w-full items-center justify-center pt-10">
      <p className="text-md text-forked-secondary-foreground md:text-xl">
        No recipes found, try changing your search
      </p>
    </div>
  );
};

export default RecipeTable;
