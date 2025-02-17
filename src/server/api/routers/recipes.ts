import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  FullRecipeSchema,
  RecipeSchemaRequest,
  RecipeSchemaResponse,
} from "../models/recipe";

export const recipesRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        max: z.number().optional(),
        query: z.string().optional(),
        // these should just be ids?
        categories: z.string().array().optional(),
        ingredients: z.string().array().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // TODO: implement pagination as we scale
      return await ctx.prisma.recipe.findMany({
        take: input.max,
        where: {
          name: { contains: input.query, mode: "insensitive" },
          ...(input.categories?.length
            ? {
                categories: {
                  some: { id: { in: input.categories, mode: "insensitive" } },
                },
              }
            : {}),
          ...(input.ingredients?.length
            ? {
                AND: input.ingredients.map((ingredient) => ({
                  ingredients: {
                    some: { name: { equals: ingredient, mode: "insensitive" } },
                  },
                })),
              }
            : {}),
        },
        orderBy: { favorites: { _count: "desc" } },
        select: { id: true, name: true },
      });
    }),
  getCategories: publicProcedure.query(async ({ ctx }) => {
    // TODO: implement pagination as we scale
    return await ctx.prisma.recipeCategory.findMany({
      select: { id: true, name: true },
    });
  }),
  getIngredients: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.ingredient.findMany({
        where: {
          name: { contains: input.name },
        },
      });
    }),
  getDetails: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.prisma.recipe.findFirst({
        where: { id: input.id },
        include: {
          ingredients: true,
          categories: true,
          favorites: true,
          steps: { orderBy: { order: "asc" } },
        },
      });

      if (!recipe) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No recipe found",
        });
      }

      const user = await ctx.prisma.user.findFirst({
        where: { id: recipe?.authorId },
      });

      // Implementing to be typesafe. May want to allow undefined here for deleted users
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No author found for recipe",
        });
      }

      const author = {
        id: user.id,
        name: user.name,
        profilePicture: user.image,
        username: user.username,
      };

      const recipeData = {
        recipe: {
          ...recipe,
          favoriteCount: recipe?.favorites.length,
          isFavorited: !!recipe?.favorites.find(
            (favorite) => favorite.userId === ctx.session?.user.id,
          ),
        },
        author,
      };

      return FullRecipeSchema.parse(recipeData);
    }),
  create: protectedProcedure
    .input(RecipeSchemaRequest)
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.prisma.recipe.create({
        data: {
          authorId: ctx.session.user.id,
          name: input.name,
          description: input.description ?? "",
          ingredients: {
            create: input.ingredients?.map(({ name, quantity, unit }) => {
              return {
                name,
                quantity,
                unit,
                ingredient: {
                  connectOrCreate: {
                    where: { name: name.toLowerCase() },
                    create: { name: name.toLowerCase() },
                  },
                },
              };
            }),
          },
          categories: {
            connectOrCreate: input.categories?.map(({ id, name }) => {
              return {
                where: { id: id },
                create: { id, name },
              };
            }),
          },
          servings: input.servings,
          prepTime: input.prepTime,
          cookTime: input.cookTime,
          steps: {
            create: input.steps?.map(({ content, order }) => {
              return { content, order };
            }),
          },
        },
        include: {
          ingredients: true,
          categories: true,
          steps: true,
        },
      });

      const user = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
      });

      // Implementing to be typesafe. May want to allow undefined here for deleted users
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No author found for recipe",
        });
      }

      const author = {
        id: user.id,
        name: user.name,
        profilePicture: user.image,
        username: user.username,
      };

      const recipeData = {
        recipe: {
          ...recipe,
          favoriteCount: 0,
          isFavorited: false,
        },
        author,
      };

      return FullRecipeSchema.parse(recipeData);
    }),
  update: protectedProcedure
    .input(RecipeSchemaRequest)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id !== input.authorId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }

      if (!input.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Recipe ID is required",
        });
      }

      const id = input.id;

      const updatedRecipe = await ctx.prisma.recipe.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          servings: input.servings,
          prepTime: input.prepTime,
          cookTime: input.cookTime,
          ingredients: {
            // Delete ingredients that are NOT in the input list
            deleteMany: {
              NOT: input.ingredients
                ?.filter((ingredient) => ingredient.ingredientId)
                .map(({ ingredientId }) => ({
                  ingredientId,
                  recipeId: id,
                })), // Ensure both keys are used
            },

            // Create new ingredients that don’t have an `ingredientId` (newly added ingredients)
            create: input.ingredients
              ?.filter((ingredient) => !ingredient.ingredientId)
              .map(({ name, unit, quantity }) => ({
                name,
                unit,
                quantity,
                ingredient: {
                  connectOrCreate: {
                    where: { name: name.toLowerCase() },
                    create: { name: name.toLowerCase() },
                  },
                },
              })),

            // Update existing ingredients
            updateMany: input.ingredients
              ?.filter((ingredient) => ingredient.ingredientId)
              .map(({ ingredientId, name, quantity, unit }) => ({
                where: { ingredientId, recipeId: id }, // Use both `ingredientId` and `recipeId`
                data: { name, quantity, unit },
              })),
          },
          categories: {
            connectOrCreate: input.categories?.map(({ id, name }) => ({
              where: { id },
              create: { id, name },
            })),
            set: input.categories?.map(({ id }) => ({ id })) ?? [],
          },
          steps: {
            // Delete steps that exist in the database but are not in the input array
            // New ingredients don’t have an id, so they are filtered them out
            deleteMany: {
              NOT: input.steps
                ?.filter((step) => step.id)
                .map(({ id }) => ({ id })),
            },

            // Create new steps that don’t have an id
            create: input.steps
              ?.filter((step) => !step.id)
              .map(({ content, order }) => ({ content, order })),

            // Update existing steps, connected by id
            updateMany: input.steps
              ?.filter((step) => step.id)
              .map(({ id, content, order }) => ({
                where: { id },
                data: { content, order },
              })),
          },
        },
        include: {
          favorites: true,
          ingredients: true,
          categories: true,
          steps: true,
        },
      });

      return RecipeSchemaResponse.parse({
        ...updatedRecipe,
        favoriteCount: updatedRecipe?.favorites.length,
        isFavorited: !!updatedRecipe?.favorites.find(
          (favorite) => favorite.userId === ctx.session?.user.id,
        ),
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string(), authorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id !== input.authorId)
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      await ctx.prisma.recipe.delete({
        where: { id: input.id },
      });
      return;
    }),
  favorite: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        authorId: z.string(),
        isFavorited: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.isFavorited) {
        // Add the recipe to the user's favorites
        await ctx.prisma.recipeFavorite.create({
          data: {
            userId: ctx.session.user.id,
            recipeId: input.id,
          },
        });
      } else {
        // Remove the recipe from the user's favorites
        await ctx.prisma.recipeFavorite.delete({
          where: {
            userId_recipeId: {
              recipeId: input.id,
              userId: ctx.session.user.id,
            },
          },
        });
      }
      return;
    }),
});

export type RecipesRouter = typeof recipesRouter;
