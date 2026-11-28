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
  id: ingredient.id,
  ingredientId: ingredient.ingredientId,
  name: ingredient.name,
  quantity: ingredient.quantity,
  unit: ingredient.unit,
  notes: ingredient.notes ?? null,
  section: ingredient.section,
  originalLine: ingredient.originalLine,
  recipeId: ingredient.recipeId,
});

export const convertIngredientFormToIngredientRequest = (
  ingredient: IngredientFormModel,
) => ({
  lineId: ingredient.lineId,
  ingredientId: ingredient.ingredientId,
  newIngredientName: ingredient.newIngredientName,
  name: ingredient.name,
  quantity: ingredient.quantity === 0 ? null : ingredient.quantity,
  unit: ingredient.unit?.trim() ? ingredient.unit.trim() : null,
  notes: ingredient.notes?.trim() ? ingredient.notes.trim() : null,
  section: ingredient.section,
  originalLine: ingredient.originalLine,
});
