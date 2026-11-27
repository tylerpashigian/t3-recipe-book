import { z } from "zod";
import { type inferRouterOutputs } from "@trpc/server";

import {
  IngredientSchemaRequest,
  IngredientSchemaResponse,
} from "./ingredient";
import { type RecipesRouter } from "../routers/recipes";
import { RecipeUrlSchema } from "./recipe-url";

const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const InstructionStepSchema = z.object({
  id: z.string().optional(),
  content: z.string(),
  order: z.number(),
});

const InstructionSectionSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  order: z.number(),
  steps: z.array(InstructionStepSchema),
});

const AuthorSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  profilePicture: z.string().nullable(),
  username: z.string().nullable(),
});

const BaseRecipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  categories: z.array(CategorySchema),
  instructionSections: z.array(InstructionSectionSchema),
  servings: z.number().optional().nullable(),
  prepTime: z.number().optional().nullable(),
  cookTime: z.number().optional().nullable(),
});

const optionalWholeNumber = z
  .number()
  .int()
  .nonnegative()
  .max(2_147_483_647)
  .nullish();

export const RecipeSchemaRequest = BaseRecipeSchema.extend({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Enter a recipe name."),
  sourceUrl: RecipeUrlSchema.nullish(),
  instructionSections: z.array(
    InstructionSectionSchema.extend({
      steps: z
        .array(
          InstructionStepSchema.extend({
            content: z.string().trim().min(1, "Enter an instruction."),
          }),
        )
        .min(1, "Add at least one step to each section."),
    }),
  ),
  ingredients: z.array(IngredientSchemaRequest).max(150),
  authorId: z.string(),
  servings: optionalWholeNumber,
  prepTime: optionalWholeNumber,
  cookTime: optionalWholeNumber,
  calories: optionalWholeNumber,
  protein: optionalWholeNumber,
  carbs: optionalWholeNumber,
  fat: optionalWholeNumber,
});

export const RecipeSchemaResponse = BaseRecipeSchema.extend({
  id: z.string(),
  sourceUrl: z.string().nullish(),
  name: z.string(),
  description: z.string(),
  ingredients: z.array(IngredientSchemaResponse),
  categories: z.array(CategorySchema),
  favoriteCount: z.number(),
  isFavorited: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  authorId: z.string().optional(),
  instructionSections: z.array(InstructionSectionSchema),
  calories: z.number().optional().nullable(),
  protein: z.number().optional().nullable(),
  carbs: z.number().optional().nullable(),
  fat: z.number().optional().nullable(),
});

export const FullRecipeSchema = z.object({
  recipe: RecipeSchemaResponse,
  author: AuthorSchema.optional(), // Optional for users that may have been deleted
});

// TODO: add author to the response
export const RecipeSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  categories: z.array(CategorySchema),
  servings: z.number().optional().nullable(),
  prepTime: z.number().optional().nullable(),
  cookTime: z.number().optional().nullable(),
  _count: z.object({
    favorites: z.number(),
  }),
});

export type GetDetailsOutput = inferRouterOutputs<RecipesRouter>["getDetails"];
export type RecipeSummarySchema = z.infer<typeof RecipeSummarySchema>;
export type FullRecipeSchemaType = z.infer<typeof FullRecipeSchema>;
export type RecipeSchemaRequestType = z.infer<typeof RecipeSchemaRequest>;
export type RecipeSchemaResponseType = z.infer<typeof RecipeSchemaResponse>;
