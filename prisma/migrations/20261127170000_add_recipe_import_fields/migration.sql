ALTER TABLE "Recipe" ADD COLUMN "sourceUrl" TEXT;

ALTER TABLE "IngredientInRecipe"
  ADD COLUMN "id" TEXT,
  ADD COLUMN "order" INTEGER,
  ADD COLUMN "section" TEXT,
  ADD COLUMN "originalLine" TEXT;

WITH lines AS (
  SELECT "ingredientId", "recipeId",
    (row_number() OVER (PARTITION BY "recipeId" ORDER BY "ingredientId") - 1)::integer AS "order"
  FROM "IngredientInRecipe"
)
UPDATE "IngredientInRecipe" AS ingredient
SET "id" = 'legacy_' || md5(ingredient."recipeId" || ':' || ingredient."ingredientId"),
    "order" = lines."order"
FROM lines
WHERE ingredient."ingredientId" = lines."ingredientId"
  AND ingredient."recipeId" = lines."recipeId";

ALTER TABLE "IngredientInRecipe"
  ALTER COLUMN "id" SET NOT NULL,
  ALTER COLUMN "order" SET NOT NULL,
  DROP CONSTRAINT "IngredientInRecipe_pkey",
  ADD CONSTRAINT "IngredientInRecipe_pkey" PRIMARY KEY ("id");

CREATE INDEX "IngredientInRecipe_ingredientId_recipeId_idx" ON "IngredientInRecipe"("ingredientId", "recipeId");
CREATE INDEX "IngredientInRecipe_recipeId_order_idx" ON "IngredientInRecipe"("recipeId", "order");
