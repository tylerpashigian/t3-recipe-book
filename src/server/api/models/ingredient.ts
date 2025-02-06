import { z } from "zod";

const BaseIngredientSchema = z.object({
  name: z.string(),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
});

export const IngredientSchemaRequest = BaseIngredientSchema.extend({
  ingredientId: z.string().optional(),
  recipeId: z.string().optional(),
});

export const IngredientSchemaResponse = BaseIngredientSchema.extend({
  ingredientId: z.string(),
  recipeId: z.string(),
});

export const IngredientSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type IngredientSummarySchemaType = z.infer<
  typeof IngredientSummarySchema
>;
export type IngredientSchemaResponseType = z.infer<
  typeof IngredientSchemaResponse
>;
