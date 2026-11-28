import { z } from "zod";

const BaseIngredientSchema = z.object({
  name: z.string(),
  quantity: z.number().finite().nullable(),
  unit: z.string().nullable(),
  section: z.string().max(250).nullish(),
  originalLine: z.string().max(2000).nullish(),
  notes: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => (value ? value : null)),
});

export const IngredientSchemaRequest = BaseIngredientSchema.extend({
  name: z.string().trim().min(1).max(250),
  quantity: z.number().finite().nonnegative().nullable(),
  unit: z.string().trim().min(1).nullable(),
  lineId: z.string().min(1).optional(),
  ingredientId: z.string().min(1).optional(),
  newIngredientName: z.string().trim().min(1).max(250).optional(),
}).refine(
  ({ ingredientId, newIngredientName }) =>
    Boolean(ingredientId) !== Boolean(newIngredientName),
  "Select an existing ingredient or explicitly add a new one.",
);

export const IngredientSchemaResponse = BaseIngredientSchema.extend({
  id: z.string(),
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
