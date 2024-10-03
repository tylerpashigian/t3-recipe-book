/*
  Warnings:

  - You are about to drop the column `newQuantity` on the `IngredientInRecipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IngredientInRecipe"
RENAME COLUMN "newQuantity" TO "quantity";
