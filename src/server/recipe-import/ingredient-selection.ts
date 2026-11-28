import { type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { type RecipeSchemaRequestType } from "~/server/api/models/recipe";

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

export async function resolveRecipeIngredients(
  tx: Prisma.TransactionClient,
  ingredients: RecipeSchemaRequestType["ingredients"],
) {
  const selectedIds = [
    ...new Set(
      ingredients.flatMap(({ ingredientId }) =>
        ingredientId ? [ingredientId] : [],
      ),
    ),
  ];
  if (selectedIds.length) {
    const count = await tx.ingredient.count({
      where: { id: { in: selectedIds } },
    });
    if (count !== selectedIds.length) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "A selected ingredient is no longer in the catalog. Choose a match again.",
      });
    }
  }

  const namesToAdd = [
    ...new Set(
      ingredients.flatMap(({ newIngredientName }) =>
        newIngredientName ? [normalizeName(newIngredientName)] : [],
      ),
    ),
  ].sort();
  const idsByName = new Map<string, string>();
  if (namesToAdd.length) {
    const catalog = await tx.ingredient.findMany({
      select: { id: true, name: true },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
    for (const entry of catalog) {
      const name = normalizeName(entry.name);
      if (!idsByName.has(name)) idsByName.set(name, entry.id);
    }

    for (const name of namesToAdd) {
      if (idsByName.has(name)) continue;
      // A single-model upsert on the unique name lets Postgres resolve concurrent inserts.
      const entry = await tx.ingredient.upsert({
        where: { name },
        create: { name },
        update: { name },
        select: { id: true },
      });
      idsByName.set(name, entry.id);
    }
  }

  return ingredients.map(
    ({ lineId, ingredientId, newIngredientName, ...line }, order) => {
      const id =
        ingredientId ?? idsByName.get(normalizeName(newIngredientName ?? ""));
      if (!id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Choose a match for every ingredient.",
        });
      }

      return { lineId, data: { ...line, ingredientId: id, order } };
    },
  );
}
