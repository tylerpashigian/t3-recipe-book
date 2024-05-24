import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const recipesRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        max: z.number().optional(),
        query: z.string().optional(),
        categories: z.string().array().optional(),
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
  getDetails: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.prisma.recipe.findFirst({
        where: { id: input.id },
        include: { ingredients: true, categories: true, favorites: true },
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
      if (!user)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No author found for recipe",
        });

      const author = {
        id: user.id,
        name: user.name,
        profilePicture: user.image,
        username: user.username,
      };

      return {
        recipe: {
          ...recipe,
          favoriteCount: recipe?.favorites.length,
          isFavorited: !!recipe?.favorites.find(
            (favorite) => favorite.userId === ctx.session?.user.id,
          ),
        },
        author,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        instructions: z.string().optional(),
        ingredients: z
          .object({ name: z.string(), quantity: z.string().nullable() })
          .array()
          .optional(),
        categories: z
          .object({ name: z.string(), id: z.string() })
          .array()
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.recipe.create({
        data: {
          authorId: ctx.session.user.id,
          name: input.name,
          description: input.description ?? "",
          instructions: input.instructions ?? "",
          ingredients: {
            create: input.ingredients?.map(({ name, quantity }) => {
              return {
                name,
                quantity,
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
        },
        include: {
          ingredients: true,
          categories: true,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        instructions: z.string().optional(),
        authorId: z.string(),
        ingredients: z
          .object({
            name: z.string(),
            quantity: z.string().nullable(),
            recipeId: z.string(),
            ingredientId: z.string(),
          })
          .array()
          .optional(),
        categories: z
          .object({
            id: z.string(),
            name: z.string(),
          })
          .array()
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id !== input.authorId)
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

      const currentRecipes = await ctx.prisma.recipe.findFirst({
        where: { id: input.id },
        include: { ingredients: true, categories: true },
      });

      const currentIngredientIds = (currentRecipes?.ingredients ?? []).map(
        (ingredient) => ingredient.ingredientId,
      );

      const currentCategoryIds = (currentRecipes?.categories ?? []).map(
        (category) => category.id,
      );

      const ingredientsToDelete = currentIngredientIds.filter(
        (id) =>
          !input.ingredients
            ?.map((ingredient) => ingredient.ingredientId)
            .includes(id),
      );

      const categoriesToDelete = currentCategoryIds
        .filter(
          (id) => !input.categories?.some((category) => category.id === id),
        )
        .map((id) => ({ id }));

      const updatedRecipe = await ctx.prisma.recipe.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          instructions: input.instructions,
          ingredients: {
            deleteMany: {
              ingredientId: {
                in: [...ingredientsToDelete],
              },
            },
            upsert: input.ingredients?.map((ingredient) => ({
              where: {
                ingredientId_recipeId: {
                  ingredientId: ingredient.ingredientId,
                  recipeId: input.id,
                },
              },
              update: {
                name: ingredient.name,
                quantity: ingredient.quantity,
                ingredient: {
                  connectOrCreate: {
                    where: { name: ingredient.name.toLowerCase() },
                    create: { name: ingredient.name.toLowerCase() },
                  },
                },
              },
              create: {
                name: ingredient.name,
                quantity: ingredient.quantity,
                ingredient: {
                  connectOrCreate: {
                    where: { name: ingredient.name.toLowerCase() },
                    create: { name: ingredient.name.toLowerCase() },
                  },
                },
              },
            })),
          },
          categories: {
            connectOrCreate: input.categories?.map(({ id, name }) => {
              return {
                where: { id: id },
                create: { id, name },
              };
            }),
            disconnect: categoriesToDelete,
          },
        },
        include: {
          ingredients: true,
          categories: true,
        },
      });

      return updatedRecipe;
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
