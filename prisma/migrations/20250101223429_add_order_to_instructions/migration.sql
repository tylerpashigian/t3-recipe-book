/*
  Warnings:

  - Added the required column `order` to the `RecipeInstructions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecipeInstructions" ADD COLUMN     "order" INTEGER NOT NULL;
