-- DropForeignKey
ALTER TABLE "RecipeFavorite" DROP CONSTRAINT "RecipeFavorite_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeInstructions" DROP CONSTRAINT "RecipeInstructions_recipeId_fkey";

-- AddForeignKey
ALTER TABLE "RecipeFavorite" ADD CONSTRAINT "RecipeFavorite_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeInstructions" ADD CONSTRAINT "RecipeInstructions_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
