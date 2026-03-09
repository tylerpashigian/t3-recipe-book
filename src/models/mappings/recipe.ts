import { type OptionType } from "~/components/UI/combobox";
import {
  type FullRecipe,
  type Recipe,
  type RecipeFormModel,
  type Category,
  RecipeSummary,
} from "../recipe";

import {
  convertIngredientFormToIngredientRequest,
  convertIngredientSchemaToIngredient,
} from "./ingredient";
import {
  RecipeSummarySchema,
  type FullRecipeSchemaType,
  type RecipeSchemaRequestType,
} from "~/server/api/models/recipe";

export const convertRecipeSummarySchemaToRecipeSummary = (
  data: RecipeSummarySchema,
): RecipeSummary => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    servings: data.servings,
    prepTime: data.prepTime,
    cookTime: data.cookTime,
    categories: data.categories,
    favoriteCount: data._count.favorites,
  };
};

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
      instructionSections: data.recipe.instructionSections.map((section) => ({
        id: section.id ?? "",
        name: section.name,
        order: section.order,
        steps: section.steps.map((step) => ({
          id: step.id ?? "",
          content: step.content,
          order: step.order,
        })),
      })),
      servings: data.recipe.servings,
      prepTime: data.recipe.prepTime,
      cookTime: data.recipe.cookTime,
      calories: data.recipe.calories,
      protein: data.recipe.protein,
      carbs: data.recipe.carbs,
      fat: data.recipe.fat,
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
  const instructionSections = data?.instructionSections?.length
    ? data.instructionSections
    : [];

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
    calories: data?.calories,
    protein: data?.protein,
    carbs: data?.carbs,
    fat: data?.fat,
    instructionSections: instructionSections.map((section, sectionIndex) => ({
      id: section.id,
      name: section.name ?? "",
      order: sectionIndex,
      steps: section.steps.map((step, stepIndex) => ({
        id: step.id,
        content: step.content ?? "",
        order: stepIndex,
      })),
    })),
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
    instructionSections: data.instructionSections.map(
      (section, sectionIndex) => ({
        id: section.id == null || section.id === "" ? undefined : section.id,
        name: section.name,
        order: sectionIndex,
        steps: section.steps.map((step, stepIndex) => ({
          id: step.id == null || step.id === "" ? undefined : step.id,
          content: step.content,
          order: stepIndex,
        })),
      }),
    ),
    categories: data.categories,
    authorId: authorId,
    calories: data.calories,
    protein: data.protein,
    carbs: data.carbs,
    fat: data.fat,
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
