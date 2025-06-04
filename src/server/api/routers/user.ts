import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { id: input.id },
        include: { favorites: true },
      });

      const recipes = await ctx.prisma.recipe.findMany({
        where: { authorId: input.id },
        include: { _count: { select: { favorites: true } }, categories: true },
      });

      const isoStringRecipes = recipes.map((recipe) => {
        const { createdAt, updatedAt, ...rest } = recipe;
        return {
          ...rest,
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
        };
      });

      return { user, recipes: isoStringRecipes };
    }),
});
