import { type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { resolveRecipeIngredients } from "~/server/recipe-import/ingredient-selection";
import { fetchRecipePage } from "~/server/recipe-import/fetch-recipe-page";
import { extractRecipeSource } from "~/server/recipe-import/extract-recipe-source";
import { prepareRecipeDraft } from "~/server/recipe-import/prepare-recipe-draft";
import { RecipeUrlSchema } from "../models/recipe-url";
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

const validateCategorySelection = async (
  tx: Prisma.TransactionClient,
  categories: { id: string }[],
) => {
  const ids = [...new Set(categories.map(({ id }) => id))];
  if (ids.length === 0) return [];

  const existingCategories = await tx.recipeCategory.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });

  if (existingCategories.length !== ids.length) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "One or more selected recipe categories do not exist.",
    });
  }

  return existingCategories;
};

export const recipesRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        max: z.number().optional(),
        query: z.string().optional(),
        // these should just be ids?
        categories: z.string().array().optional(),
        ingredientIds: z.string().array().optional(),
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
          ...(input.ingredientIds?.length
            ? {
                AND: input.ingredientIds.map((ingredientId) => ({
                  ingredients: {
                    some: {
                      ingredientId,
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
      const recipe = await ctx.prisma.recipe.findUnique({
        where: { id: input.id },
        include: {
          ingredients: { orderBy: { order: "asc" } },
          categories: true,
          _count: { select: { favorites: true } },
          instructionSections: {
            orderBy: { order: "asc" },
            include: { steps: { orderBy: { order: "asc" } } },
          },
        },
      });
      if (!recipe) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No recipe found" });
      }

      const author = await ctx.prisma.user.findUnique({
        where: { id: recipe.authorId },
        select: { id: true, name: true, image: true, username: true },
      });

      const favorite = ctx.session?.user.id
        ? await ctx.prisma.recipeFavorite.findUnique({
            where: {
              userId_recipeId: {
                userId: ctx.session.user.id,
                recipeId: input.id,
              },
            },
            select: { recipeId: true },
          })
        : null;

      return FullRecipeSchema.parse({
        recipe: {
          ...recipe,
          favoriteCount: recipe._count.favorites,
          isFavorited: !!favorite,
        },
        author: author
          ? {
              id: author.id,
              name: author.name,
              profilePicture: author.image,
              username: author.username,
            }
          : undefined,
      });
    }),
  importFromUrl: protectedProcedure
    .input(z.object({ url: RecipeUrlSchema }))
    .mutation(async ({ ctx, input }) => {
      let source: ReturnType<typeof extractRecipeSource>;
      try {
        source = extractRecipeSource(await fetchRecipePage(input.url));
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Forked couldn’t read that recipe page. Try another link or enter the recipe manually.",
        });
      }
      const [catalog, categories] = await Promise.all([
        ctx.prisma.ingredient.findMany({
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        }),
        ctx.prisma.recipeCategory.findMany({
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        }),
      ]);
      let draft: Awaited<ReturnType<typeof prepareRecipeDraft>>;
      try {
        draft = await prepareRecipeDraft(
          input.url,
          source,
          catalog,
          categories,
        );
      } catch (error) {
        console.warn("[recipe-import] draft failed", {
          error: error instanceof Error ? error.name : "UnknownError",
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Forked couldn’t prepare the draft. Try again or enter the recipe manually.",
        });
      }
      if (!draft.ingredients.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No recipe ingredient lines were found on that page.",
        });
      }
      return draft;
    }),
  create: protectedProcedure
    .input(RecipeSchemaRequest)
    .mutation(async ({ ctx, input }) => {
      const instructionSections = normalizeInstructionSections(
        input.instructionSections,
      );

      const recipe = await ctx.prisma.$transaction(async (tx) => {
        const categories = await validateCategorySelection(
          tx,
          input.categories,
        );
        const ingredients = await resolveRecipeIngredients(
          tx,
          input.ingredients,
        );
        const createdRecipe = await tx.recipe.create({
          data: {
            authorId: ctx.session.user.id,
            name: input.name,
            description: input.description ?? "",
            sourceUrl: input.sourceUrl,
            ingredients: { create: ingredients.map(({ data }) => data) },
            categories: { connect: categories },
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
            ingredients: { orderBy: { order: "asc" } },
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

      revalidatePath(`/recipe/${recipe.id}`);
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
        const categories = await validateCategorySelection(
          tx,
          input.categories,
        );
        const ingredients = await resolveRecipeIngredients(
          tx,
          input.ingredients,
        );
        const lineIds = ingredients.flatMap(({ lineId }) =>
          lineId ? [lineId] : [],
        );
        if (new Set(lineIds).size !== lineIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Ingredient lines must be unique.",
          });
        }
        if (lineIds.length) {
          const count = await tx.ingredientInRecipe.count({
            where: { recipeId: id, id: { in: lineIds } },
          });
          if (count !== lineIds.length) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "An ingredient line is no longer on this recipe. Reload before editing.",
            });
          }
        }
        await tx.recipe.update({
          where: { id: input.id, authorId: ctx.session.user.id },
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
            sourceUrl: input.sourceUrl,
            ingredients: {
              deleteMany: { id: { notIn: lineIds } },
              create: ingredients
                .filter(({ lineId }) => !lineId)
                .map(({ data }) => data),
              update: ingredients.flatMap(({ lineId, data }) =>
                lineId ? [{ where: { id: lineId }, data }] : [],
              ),
            },
            categories: { set: categories },
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
            const sectionId = section.id;

            await tx.recipeInstructionSection.update({
              where: { id: sectionId },
              data: { name: section.name, order: section.order },
            });

            const existingSteps = await tx.recipeInstructionStep.findMany({
              where: { instructionSectionId: sectionId },
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
                  instructionSectionId: sectionId,
                  content: step.content,
                  order: step.order,
                })),
              });
            }

            for (const step of section.steps.filter((item) => item.id)) {
              if (!!step.id && !existingStepIds.includes(step.id)) {
                throw new TRPCError({
                  code: "FORBIDDEN",
                  message: "Invalid step id for this recipe section",
                });
              }

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
            ingredients: { orderBy: { order: "asc" } },
            categories: true,
            instructionSections: {
              orderBy: { order: "asc" },
              include: { steps: { orderBy: { order: "asc" } } },
            },
          },
        });
      });

      revalidatePath(`/recipe/${id}`);
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
      revalidatePath(`/recipe/${input.id}`);
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
