import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const recipesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // TODO: implement pagination as we scale
    return await ctx.prisma.recipe.findMany({
      take: 100,
      select: { id: true, name: true },
    });
  }),
  getDetails: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.prisma.recipe.findFirst({
        where: { id: input.id },
        include: { ingredients: true },
      });

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
        recipe,
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
          .object({ name: z.string(), quantity: z.number(), unit: z.string() })
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
            quantity: z.number(),
            unit: z.string(),
            recipeId: z.string(),
            ingredientId: z.string(),
          })
          .array()
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id !== input.authorId)
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      const currentIngredients = await ctx.prisma.recipe.findFirst({
        where: { id: input.id },
        include: { ingredients: true },
      });

      const currentIds = (currentIngredients?.ingredients ?? []).map(
        (ingredient) => ingredient.ingredientId,
      );

      const ingredientsToDelete = currentIds.filter(
        (id) =>
          !input.ingredients
            ?.map((ingredient) => ingredient.ingredientId)
            .includes(id),
      );

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
                unit: ingredient.unit,
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
                unit: ingredient.unit,
                ingredient: {
                  connectOrCreate: {
                    where: { name: ingredient.name.toLowerCase() },
                    create: { name: ingredient.name.toLowerCase() },
                  },
                },
              },
            })),
          },
        },
        include: {
          ingredients: true,
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
});
