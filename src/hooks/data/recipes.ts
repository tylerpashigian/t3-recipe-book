import { useRecipeService } from "~/service/recipe-service";

interface Props {
  query?: string;
  categories?: string[];
  ingredients?: string[];
}

export const useRecipes = ({ query, categories, ingredients }: Props) => {
  // TODO: support local copy of recipes?
  const { recipes } = useRecipeService(undefined, {
    query,
    categories: categories,
    ingredients: ingredients,
  });

  return {
    recipes: recipes.recipes,
    isLoading: recipes.isLoading,
  };
};
