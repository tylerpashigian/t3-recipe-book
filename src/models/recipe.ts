import { type RecipeCategory, type Prisma } from "@prisma/client";

export type Recipe = Prisma.RecipeGetPayload<{
  include: {
    ingredients: true;
    categories: { select: { id: true; name: true } };
  };
}> & {
  isFavorited: boolean;
  favoriteCount: number;
  steps: { id?: string; content: string; order: number }[];
};

export type Category = Pick<RecipeCategory, "id" | "name">;
