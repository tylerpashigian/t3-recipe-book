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
                name,
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
