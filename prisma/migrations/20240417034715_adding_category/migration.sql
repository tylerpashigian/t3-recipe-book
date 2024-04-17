-- CreateTable
CREATE TABLE "RecipeCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RecipeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RecipeToRecipeCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RecipeToRecipeCategory_AB_unique" ON "_RecipeToRecipeCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_RecipeToRecipeCategory_B_index" ON "_RecipeToRecipeCategory"("B");

-- AddForeignKey
ALTER TABLE "_RecipeToRecipeCategory" ADD CONSTRAINT "_RecipeToRecipeCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeToRecipeCategory" ADD CONSTRAINT "_RecipeToRecipeCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "RecipeCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
