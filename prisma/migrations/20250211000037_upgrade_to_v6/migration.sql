-- AlterTable
ALTER TABLE "_RecipeToRecipeCategory" ADD CONSTRAINT "_RecipeToRecipeCategory_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_RecipeToRecipeCategory_AB_unique";
