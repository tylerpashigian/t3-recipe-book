import { z } from "zod";
import { type inferRouterOutputs } from "@trpc/server";

import {
  IngredientSchemaRequest,
  IngredientSchemaResponse,
} from "./ingredient";
import { type RecipesRouter } from "../routers/recipes";

const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const InstructionSchema = z.object({
  id: z.string().optional(),
  content: z.string(),
  order: z.number(),
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
  steps: z.array(InstructionSchema),
  servings: z.number().optional().nullable(),
  prepTime: z.number().optional().nullable(),
  cookTime: z.number().optional().nullable(),
});

export const RecipeSchemaRequest = BaseRecipeSchema.extend({
  id: z.string().optional(),
  ingredients: z.array(IngredientSchemaRequest),
  authorId: z.string(),
});

export const RecipeSchemaResponse = BaseRecipeSchema.extend({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  ingredients: z.array(IngredientSchemaResponse),
  categories: z.array(CategorySchema),
  favoriteCount: z.number(),
  isFavorited: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  authorId: z.string().optional(),
  steps: z.array(InstructionSchema),
});

export const FullRecipeSchema = z.object({
  recipe: RecipeSchemaResponse,
  author: AuthorSchema.optional(), // Optional for users that may have been deleted
});

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
