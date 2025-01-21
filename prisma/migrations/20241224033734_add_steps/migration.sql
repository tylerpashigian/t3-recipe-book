-- CreateTable
CREATE TABLE "RecipeInstructions" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "RecipeInstructions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeInstructions" ADD CONSTRAINT "RecipeInstructions_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
