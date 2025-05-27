import { useRecipeService } from "~/service/recipe-service";

interface Props {
  query?: string;
  categories?: string[];
}

export const useRecipes = ({ query, categories }: Props) => {
  // TODO: support local copy of recipes?
  const { recipes } = useRecipeService(undefined, {
    query,
    categories: categories,
  });

  return {
    recipes: recipes.recipes,
    isLoading: recipes.isLoading,
  };
};
