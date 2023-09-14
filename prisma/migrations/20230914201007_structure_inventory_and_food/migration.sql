/*
  Warnings:

  - You are about to drop the column `characterId` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `materialId` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `characterId` on the `ToolInstance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inventoryId]` on the table `BuiltStructure` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inventoryId]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inventoryId` to the `Character` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Inventory` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `inventoryId` to the `ToolInstance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_materialId_fkey";

-- DropForeignKey
ALTER TABLE "ToolInstance" DROP CONSTRAINT "ToolInstance_characterId_fkey";

-- DropIndex
DROP INDEX "Inventory_characterId_materialId_key";

-- AlterTable
ALTER TABLE "BuiltStructure" ADD COLUMN     "inventoryId" TEXT;

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "inventoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "characterId",
DROP COLUMN "materialId",
DROP COLUMN "quantity",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Structure" ADD COLUMN     "hasInventory" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ToolInstance" DROP COLUMN "characterId",
ADD COLUMN     "inventoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "description" TEXT,
    "title" TEXT NOT NULL,
    "pluralTitle" TEXT,
    "durability" INTEGER NOT NULL DEFAULT 40,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodInstance" (
    "id" TEXT NOT NULL,
    "durability" INTEGER NOT NULL,
    "lastDurabilitySet" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "foodId" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,

    CONSTRAINT "FoodInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PosessedMaterial" (
    "inventoryId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "ActionFoodLoot" (
    "foodId" TEXT NOT NULL,
    "minQuantity" INTEGER NOT NULL DEFAULT 1,
    "maxQuantity" INTEGER NOT NULL DEFAULT 1,
    "actionId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PosessedMaterial_inventoryId_materialId_key" ON "PosessedMaterial"("inventoryId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "ActionFoodLoot_actionId_foodId_key" ON "ActionFoodLoot"("actionId", "foodId");

-- CreateIndex
CREATE UNIQUE INDEX "BuiltStructure_inventoryId_key" ON "BuiltStructure"("inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Character_inventoryId_key" ON "Character"("inventoryId");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodInstance" ADD CONSTRAINT "FoodInstance_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodInstance" ADD CONSTRAINT "FoodInstance_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolInstance" ADD CONSTRAINT "ToolInstance_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosessedMaterial" ADD CONSTRAINT "PosessedMaterial_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosessedMaterial" ADD CONSTRAINT "PosessedMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuiltStructure" ADD CONSTRAINT "BuiltStructure_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionFoodLoot" ADD CONSTRAINT "ActionFoodLoot_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionFoodLoot" ADD CONSTRAINT "ActionFoodLoot_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
