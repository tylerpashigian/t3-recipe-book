import { type IngredientFormModel } from "../ingredient";
import {
  type IngredientSchemaResponseType,
  type IngredientSummarySchemaType,
} from "~/server/api/models/ingredient";

export const convertIngredientSchemaToIngredientSummary = (
  ingredient: IngredientSummarySchemaType,
) => ({
  id: ingredient.id,
  name: ingredient.name,
});

export const convertIngredientSchemaToIngredient = (
  ingredient: IngredientSchemaResponseType,
) => ({
  id: ingredient.ingredientId,
  name: ingredient.name,
  quantity: ingredient.quantity,
  unit: ingredient.unit,
  recipeId: ingredient.recipeId,
});

export const convertIngredientFormToIngredientRequest = (
  ingredient: IngredientFormModel,
  recipeId: string | undefined,
) => ({
  ingredientId: ingredient.id ?? undefined,
  name: ingredient.name,
  quantity: ingredient.quantity,
  unit: ingredient.unit,
  recipeId: recipeId,
});
