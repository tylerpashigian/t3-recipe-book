import { RecipeCategory, type Prisma } from "@prisma/client";

export type Recipe = Prisma.RecipeGetPayload<{
  include: {
    ingredients: true;
    categories: { select: { id: true; name: true } };
  };
}>;

export type Category = Pick<RecipeCategory, "id" | "name">;
