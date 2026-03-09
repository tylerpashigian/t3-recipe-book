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
  RecipeSummarySchema,
} from "../models/recipe";

const normalizeInstructionSections = (
  sections: {
    id?: string;
    name: string;
    order: number;
    steps: { id?: string; content: string; order: number }[];
  }[],
) => {
  const normalizedSections = sections.length ? sections : [];

  return normalizedSections.map((section, sectionIndex) => ({
    id: section.id,
    name: section.name,
    order: sectionIndex,
    steps: section.steps.map((step, stepIndex) => ({
      id: step.id,
      content: step.content,
      order: stepIndex,
    })),
  }));
};

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
      const recipes = await ctx.prisma.recipe.findMany({
        take: input.max,
        where: {
          ...(input.query
            ? { name: { contains: input.query, mode: "insensitive" } }
            : {}),
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
                    some: {
                      name: { equals: ingredient, mode: "insensitive" },
                    },
                  },
                })),
              }
            : {}),
        },
        orderBy: { favorites: { _count: "desc" } },
        select: {
          id: true,
          name: true,
          categories: true,
          description: true,
          prepTime: true,
          cookTime: true,
          servings: true,
          _count: { select: { favorites: true } },
        },
      });
      return recipes.map((recipe) => RecipeSummarySchema.parse(recipe));
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
          instructionSections: {
            orderBy: { order: "asc" },
            include: {
              steps: {
                orderBy: { order: "asc" },
              },
            },
          },
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
      const instructionSections = normalizeInstructionSections(
        input.instructionSections,
      );

      const recipe = await ctx.prisma.$transaction(async (tx) => {
        const createdRecipe = await tx.recipe.create({
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
            calories: input.calories,
            protein: input.protein,
            carbs: input.carbs,
            fat: input.fat,
          },
        });

        for (const section of instructionSections) {
          await tx.recipeInstructionSection.create({
            data: {
              recipeId: createdRecipe.id,
              name: section.name,
              order: section.order,
              steps: {
                create: section.steps.map(({ content, order }) => ({
                  recipeId: createdRecipe.id,
                  content,
                  order,
                })),
              },
            },
          });
        }

        return tx.recipe.findUniqueOrThrow({
          where: { id: createdRecipe.id },
          include: {
            ingredients: true,
            categories: true,
            instructionSections: {
              orderBy: { order: "asc" },
              include: {
                steps: {
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        });
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
      const instructionSections = normalizeInstructionSections(
        input.instructionSections,
      );

      const updatedRecipe = await ctx.prisma.$transaction(async (tx) => {
        await tx.recipe.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
            servings: input.servings,
            prepTime: input.prepTime,
            cookTime: input.cookTime,
            calories: input.calories,
            protein: input.protein,
            carbs: input.carbs,
            fat: input.fat,
            ingredients: {
              deleteMany: {
                NOT: input.ingredients
                  ?.filter((ingredient) => ingredient.ingredientId)
                  .map(({ ingredientId }) => ({
                    ingredientId,
                    recipeId: id,
                  })),
              },
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
              updateMany: input.ingredients
                ?.filter((ingredient) => ingredient.ingredientId)
                .map(({ ingredientId, name, quantity, unit }) => ({
                  where: { ingredientId, recipeId: id },
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
          },
        });

        const existingSections = await tx.recipeInstructionSection.findMany({
          where: { recipeId: id },
          select: { id: true },
        });

        const existingSectionIds = existingSections.map(
          (section) => section.id,
        );
        const inputSectionIds = instructionSections
          .map((section) => section.id)
          .filter((sectionId): sectionId is string => !!sectionId);

        const sectionIdsToDelete = existingSectionIds.filter(
          (sectionId) => !inputSectionIds.includes(sectionId),
        );

        if (sectionIdsToDelete.length) {
          await tx.recipeInstructionSection.deleteMany({
            where: { id: { in: sectionIdsToDelete } },
          });
        }

        for (const section of instructionSections) {
          if (section.id && existingSectionIds.includes(section.id)) {
            await tx.recipeInstructionSection.update({
              where: { id: section.id },
              data: { name: section.name, order: section.order },
            });

            const existingSteps = await tx.recipeInstructionStep.findMany({
              where: { instructionSectionId: section.id },
              select: { id: true },
            });

            const existingStepIds = existingSteps.map((step) => step.id);
            const inputStepIds = section.steps
              .map((step) => step.id)
              .filter((stepId): stepId is string => !!stepId);

            const stepIdsToDelete = existingStepIds.filter(
              (stepId) => !inputStepIds.includes(stepId),
            );

            if (stepIdsToDelete.length) {
              await tx.recipeInstructionStep.deleteMany({
                where: { id: { in: stepIdsToDelete } },
              });
            }

            const newSteps = section.steps.filter((step) => !step.id);
            if (newSteps.length) {
              await tx.recipeInstructionStep.createMany({
                data: newSteps.map((step) => ({
                  recipeId: id,
                  instructionSectionId: section.id,
                  content: step.content,
                  order: step.order,
                })),
              });
            }

            for (const step of section.steps.filter((item) => item.id)) {
              await tx.recipeInstructionStep.update({
                where: { id: step.id },
                data: { content: step.content, order: step.order },
              });
            }
          } else {
            await tx.recipeInstructionSection.create({
              data: {
                recipeId: id,
                name: section.name,
                order: section.order,
                steps: {
                  create: section.steps.map((step) => ({
                    recipeId: id,
                    content: step.content,
                    order: step.order,
                  })),
                },
              },
            });
          }
        }

        return tx.recipe.findUniqueOrThrow({
          where: { id: input.id },
          include: {
            favorites: true,
            ingredients: true,
            categories: true,
            instructionSections: {
              orderBy: { order: "asc" },
              include: { steps: { orderBy: { order: "asc" } } },
            },
          },
        });
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
