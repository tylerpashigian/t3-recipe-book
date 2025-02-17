import { type OptionType } from "~/components/UI/combobox";
import {
  type FullRecipe,
  type Recipe,
  type RecipeFormModel,
  type Category,
} from "../recipe";

import {
  convertIngredientFormToIngredientRequest,
  convertIngredientSchemaToIngredient,
} from "./ingredient";
import {
  type FullRecipeSchemaType,
  type RecipeSchemaRequestType,
} from "~/server/api/models/recipe";

export const convertRecipeSchemaToRecipe = (
  data: FullRecipeSchemaType,
): FullRecipe => {
  return {
    recipe: {
      id: data.recipe.id,
      name: data.recipe.name,
      description: data.recipe.description,
      ingredients: data.recipe.ingredients.map(
        convertIngredientSchemaToIngredient,
      ),
      steps: data.recipe.steps.map((step) => ({
        id: step.id ?? "",
        content: step.content,
        order: step.order,
      })),
      servings: data.recipe.servings,
      prepTime: data.recipe.prepTime,
      cookTime: data.recipe.cookTime,
      categories: data.recipe.categories,
      isFavorited: data.recipe.isFavorited,
      favoriteCount: data.recipe.favoriteCount,
    },
    author: {
      id: data.author?.id ?? "",
      name: data.author?.name,
      profilePicture: data.author?.profilePicture,
      username: data.author?.username,
    },
  };
};

export const convertRecipeToRecipeForm = (
  data: Recipe | undefined,
): RecipeFormModel => {
  return {
    id: data?.id,
    name: data?.name ?? "",
    description: data?.description ?? "",
    ingredients:
      data?.ingredients.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name ?? "",
        quantity: ingredient.quantity ?? 0,
        unit: ingredient.unit ?? "",
        recipeId: data.id,
      })) ?? [],
    servings: data?.servings,
    prepTime: data?.prepTime,
    cookTime: data?.cookTime,
    steps:
      data?.steps.map((step) => ({
        id: step.id,
        content: step.content ?? "",
        order: step.order,
      })) ?? [],
    categories: data?.categories ?? [],
  };
};

export const convertRecipeFormToRecipeRequest = (
  data: RecipeFormModel,
  authorId: string,
): RecipeSchemaRequestType => {
  return {
    id: data.id ?? undefined,
    name: data.name,
    description: data.description,
    ingredients: data.ingredients.map((ingredient) =>
      convertIngredientFormToIngredientRequest(
        ingredient,
        data.id ?? undefined,
      ),
    ),
    servings: data.servings,
    prepTime: data.prepTime,
    cookTime: data.cookTime,
    steps: data.steps.map((step) => ({
      content: step.content,
      order: step.order,
    })),
    categories: data.categories,
    authorId: authorId,
  };
};

export const categoryToOption = (category: Category): OptionType => {
  return {
    value: category.id,
    label: category.name,
  };
};

export const optionToCategory = (category: OptionType): Category => {
  return {
    id: category.value,
    name: category.label,
  };
};
