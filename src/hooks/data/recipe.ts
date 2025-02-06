import { useRecipeService } from "~/service/recipe-service";

export const useRecipe = (id?: string | undefined) => {
  // TODO: support local copy of recipe?
  const {
    details,
    update,
    create,
    delete: deleteRecipe,
    categories,
    ingredients,
  } = useRecipeService(id);

  // we don't want to block the UI if we're loading ingredients or categories
  // we also don't want to block the UI if we're deleting a recipe, should navigate
  const isLoading = details.isLoading || update.isUpdating || create.isCreating;

  return {
    recipe: details.recipe,
    isLoading,
    update: update.updateRecipe,
    create: create.createRecipe,
    delete: deleteRecipe.deleteRecipe,
    favorite: details.favoriteRecipe,
    categories: categories.categories,
    allIngredients: ingredients.allIngredients,
  };
};
