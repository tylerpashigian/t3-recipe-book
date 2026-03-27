/*
  Warnings:

  - You are about to drop the column `recipeId` on the `RecipeInstructions` table. All the data in the column will be lost.
  - Made the column `instructionSectionId` on table `RecipeInstructions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "RecipeInstructions" DROP CONSTRAINT "RecipeInstructions_recipeId_fkey";

-- DropIndex
DROP INDEX "RecipeInstructions_recipeId_idx";

-- AlterTable
ALTER TABLE "RecipeInstructions" DROP COLUMN "recipeId",
ALTER COLUMN "instructionSectionId" SET NOT NULL;
