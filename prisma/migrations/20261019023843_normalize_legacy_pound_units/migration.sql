UPDATE "IngredientInRecipe"
SET "unit" = 'pound'
WHERE "unit" IN ('lb', 'lbs');