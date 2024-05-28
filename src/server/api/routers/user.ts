import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../../server/api/trpc";

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
      });

      return { user, recipes };
    }),
});
