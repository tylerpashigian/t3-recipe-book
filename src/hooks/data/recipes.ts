import { useRecipeService } from "~/service/recipe-service";

interface Props {
  query?: string;
  categories?: string[];
  ingredientIds?: string[];
}

export const useRecipes = ({ query, categories, ingredientIds }: Props) => {
  // TODO: support local copy of recipes?
  const { recipes } = useRecipeService(undefined, {
    query,
    categories: categories,
    ingredientIds,
  });

  return {
    recipes: recipes.recipes,
    isLoading: recipes.isLoading,
  };
};
