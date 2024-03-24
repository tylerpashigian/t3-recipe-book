import { type Prisma } from "@prisma/client";

export type Recipe = Prisma.RecipeGetPayload<{
  include: { ingredients: true };
}>;
