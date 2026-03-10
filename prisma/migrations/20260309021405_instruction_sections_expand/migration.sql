-- AlterTable
ALTER TABLE "RecipeInstructions" ADD COLUMN     "instructionSectionId" TEXT;

-- CreateTable
CREATE TABLE "RecipeInstructionSection" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL,

    CONSTRAINT "RecipeInstructionSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecipeInstructionSection_recipeId_idx" ON "RecipeInstructionSection"("recipeId");

-- CreateIndex
CREATE INDEX "RecipeInstructionSection_recipeId_order_idx" ON "RecipeInstructionSection"("recipeId", "order");

-- CreateIndex
CREATE INDEX "RecipeInstructions_recipeId_idx" ON "RecipeInstructions"("recipeId");

-- CreateIndex
CREATE INDEX "RecipeInstructions_instructionSectionId_idx" ON "RecipeInstructions"("instructionSectionId");

-- CreateIndex
CREATE INDEX "RecipeInstructions_instructionSectionId_order_idx" ON "RecipeInstructions"("instructionSectionId", "order");

-- Backfill plan for instruction sections.
-- Intended to be copied into a Prisma migration.sql file created via:
-- pnpm prisma migrate dev --name instruction-sections --create-only

-- 1) Create a default unnamed section for every recipe that does not have one.
INSERT INTO "RecipeInstructionSection" (
  "id",
  "recipeId",
  "createdAt",
  "updatedAt",
  "name",
  "order"
)
SELECT
  CONCAT('default-section-', r."id"),
  r."id",
  NOW(),
  NOW(),
  '',
  0
FROM "Recipe" r
WHERE NOT EXISTS (
  SELECT 1
  FROM "RecipeInstructionSection" s
  WHERE s."recipeId" = r."id"
);

-- 2) Attach every existing step row to the recipe's default section if not already attached.
UPDATE "RecipeInstructions" i
SET "instructionSectionId" = CONCAT('default-section-', i."recipeId")
WHERE i."instructionSectionId" IS NULL;

-- 3) Validation checks to run after backfill.
-- SELECT COUNT(*) FROM "RecipeInstructions" WHERE "instructionSectionId" IS NULL;
-- SELECT COUNT(*) FROM "Recipe" r
-- LEFT JOIN "RecipeInstructionSection" s ON s."recipeId" = r."id"
-- WHERE s."id" IS NULL;

-- AddForeignKey
ALTER TABLE "RecipeInstructionSection" ADD CONSTRAINT "RecipeInstructionSection_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeInstructions" ADD CONSTRAINT "RecipeInstructions_instructionSectionId_fkey" FOREIGN KEY ("instructionSectionId") REFERENCES "RecipeInstructionSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
