import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const recipesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const recipes = await ctx.prisma.recipe.findMany({
      take: 100,
      include: { ingredients: true },
    });
    const users = (
      await ctx.prisma.user.findMany({
        where: { id: { in: [...recipes.map((recipe) => recipe.authorId)] } },
      })
    ).map((user) => ({
      id: user.id,
      name: user.name,
      profilePicture: user.image,
    }));

    return recipes.map((recipe) => {
      const author = users.find((user) => user.id === recipe.authorId);
      // Implementing to be typesafe. May want to allow undefined here for deleted users
      if (!author)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No author found for recipe",
        });
      return {
        recipe,
        author,
      };
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        instructions: z.string(),
        ingredients: z
          .object({ name: z.string(), quantity: z.number(), unit: z.string() })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.recipe.create({
        data: {
          authorId: ctx.session.user.id,
          name: input.name,
          description: input.description,
          instructions: input.instructions,
          ingredients: {
            create: input.ingredients.map(({ name, quantity, unit }) => {
              return {
                quantity,
                unit,
                ingredient: {
                  connectOrCreate: {
                    where: { name: name.toLowerCase() },
                    create: { name: name.toLowerCase() }, // Include quantity and unit in the create field
                  },
                },
              };
            }),
          },
        },
      });
    }),
});
