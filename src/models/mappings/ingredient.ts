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
  notes: ingredient.notes ?? null,
  recipeId: ingredient.recipeId,
});

export const convertIngredientFormToIngredientRequest = (
  ingredient: IngredientFormModel,
  recipeId: string | undefined,
) => ({
  ingredientId: ingredient.id ?? undefined,
  name: ingredient.name,
  quantity: ingredient.quantity === 0 ? null : ingredient.quantity,
  unit: ingredient.unit?.trim() ? ingredient.unit.trim() : null,
  notes: ingredient.notes?.trim() ? ingredient.notes.trim() : null,
  recipeId: recipeId,
});
