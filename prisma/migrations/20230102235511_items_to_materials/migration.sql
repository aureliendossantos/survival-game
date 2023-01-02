/*
  Warnings:

  - You are about to drop the column `itemId` on the `ActionCost` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `ActionLoot` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Inventory` table. All the data in the column will be lost.
  - The primary key for the `Structure` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `itemId` on the `StructureCost` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `StructureRepairCost` table. All the data in the column will be lost.
  - The primary key for the `Tool` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[actionId,materialId]` on the table `ActionCost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[actionId,materialId]` on the table `ActionLoot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[characterId,materialId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[structureId,materialId]` on the table `StructureCost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[structureId,materialId]` on the table `StructureRepairCost` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `materialId` to the `ActionCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `materialId` to the `ActionLoot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `materialId` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `materialId` to the `StructureCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `materialId` to the `StructureRepairCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_structureId_fkey";

-- DropForeignKey
ALTER TABLE "ActionCost" DROP CONSTRAINT "ActionCost_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ActionLoot" DROP CONSTRAINT "ActionLoot_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ActionToolLoot" DROP CONSTRAINT "ActionToolLoot_toolId_fkey";

-- DropForeignKey
ALTER TABLE "BuiltStructure" DROP CONSTRAINT "BuiltStructure_structureId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Structure" DROP CONSTRAINT "Structure_moduleOfId_fkey";

-- DropForeignKey
ALTER TABLE "Structure" DROP CONSTRAINT "Structure_upgradeOfId_fkey";

-- DropForeignKey
ALTER TABLE "StructureCost" DROP CONSTRAINT "StructureCost_itemId_fkey";

-- DropForeignKey
ALTER TABLE "StructureCost" DROP CONSTRAINT "StructureCost_structureId_fkey";

-- DropForeignKey
ALTER TABLE "StructureRepairCost" DROP CONSTRAINT "StructureRepairCost_itemId_fkey";

-- DropForeignKey
ALTER TABLE "StructureRepairCost" DROP CONSTRAINT "StructureRepairCost_structureId_fkey";

-- DropForeignKey
ALTER TABLE "ToolInstance" DROP CONSTRAINT "ToolInstance_toolId_fkey";

-- DropForeignKey
ALTER TABLE "_ActionToTool" DROP CONSTRAINT "_ActionToTool_B_fkey";

-- DropForeignKey
ALTER TABLE "_StructureRepairTools" DROP CONSTRAINT "_StructureRepairTools_A_fkey";

-- DropForeignKey
ALTER TABLE "_StructureRepairTools" DROP CONSTRAINT "_StructureRepairTools_B_fkey";

-- DropForeignKey
ALTER TABLE "_StructureToTool" DROP CONSTRAINT "_StructureToTool_A_fkey";

-- DropForeignKey
ALTER TABLE "_StructureToTool" DROP CONSTRAINT "_StructureToTool_B_fkey";

-- DropIndex
DROP INDEX "ActionCost_actionId_itemId_key";

-- DropIndex
DROP INDEX "ActionLoot_actionId_itemId_key";

-- DropIndex
DROP INDEX "Inventory_characterId_itemId_key";

-- DropIndex
DROP INDEX "StructureCost_structureId_itemId_key";

-- DropIndex
DROP INDEX "StructureRepairCost_structureId_itemId_key";

-- AlterTable
ALTER TABLE "Action" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "structureId" SET DATA TYPE TEXT;
DROP SEQUENCE "Action_id_seq";

-- AlterTable
ALTER TABLE "ActionCost" DROP COLUMN "itemId",
ADD COLUMN     "materialId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ActionLoot" DROP COLUMN "itemId",
ADD COLUMN     "materialId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ActionToolLoot" ALTER COLUMN "toolId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "BuiltStructure" ALTER COLUMN "structureId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "itemId",
ADD COLUMN     "materialId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Structure" DROP CONSTRAINT "Structure_pkey",
ADD COLUMN     "repairStamina" INTEGER NOT NULL DEFAULT -1,
ADD COLUMN     "requiredStamina" INTEGER NOT NULL DEFAULT -1,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "moduleOfId" SET DATA TYPE TEXT,
ALTER COLUMN "upgradeOfId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Structure_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Structure_id_seq";

-- AlterTable
ALTER TABLE "StructureCost" DROP COLUMN "itemId",
ADD COLUMN     "materialId" TEXT NOT NULL,
ALTER COLUMN "structureId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StructureRepairCost" DROP COLUMN "itemId",
ADD COLUMN     "materialId" TEXT NOT NULL,
ALTER COLUMN "structureId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_pkey",
ADD COLUMN     "order" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Tool_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Tool_id_seq";

-- AlterTable
ALTER TABLE "ToolInstance" ALTER COLUMN "toolId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_ActionToTool" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_StructureRepairTools" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_StructureToTool" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Item";

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "pluralTitle" TEXT,
    "description" TEXT,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActionCost_actionId_materialId_key" ON "ActionCost"("actionId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "ActionLoot_actionId_materialId_key" ON "ActionLoot"("actionId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_characterId_materialId_key" ON "Inventory"("characterId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "StructureCost_structureId_materialId_key" ON "StructureCost"("structureId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "StructureRepairCost_structureId_materialId_key" ON "StructureRepairCost"("structureId", "materialId");

-- AddForeignKey
ALTER TABLE "ToolInstance" ADD CONSTRAINT "ToolInstance_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuiltStructure" ADD CONSTRAINT "BuiltStructure_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Structure" ADD CONSTRAINT "Structure_moduleOfId_fkey" FOREIGN KEY ("moduleOfId") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Structure" ADD CONSTRAINT "Structure_upgradeOfId_fkey" FOREIGN KEY ("upgradeOfId") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StructureCost" ADD CONSTRAINT "StructureCost_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StructureCost" ADD CONSTRAINT "StructureCost_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StructureRepairCost" ADD CONSTRAINT "StructureRepairCost_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StructureRepairCost" ADD CONSTRAINT "StructureRepairCost_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionCost" ADD CONSTRAINT "ActionCost_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionLoot" ADD CONSTRAINT "ActionLoot_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionToolLoot" ADD CONSTRAINT "ActionToolLoot_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StructureToTool" ADD CONSTRAINT "_StructureToTool_A_fkey" FOREIGN KEY ("A") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StructureToTool" ADD CONSTRAINT "_StructureToTool_B_fkey" FOREIGN KEY ("B") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StructureRepairTools" ADD CONSTRAINT "_StructureRepairTools_A_fkey" FOREIGN KEY ("A") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StructureRepairTools" ADD CONSTRAINT "_StructureRepairTools_B_fkey" FOREIGN KEY ("B") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToTool" ADD CONSTRAINT "_ActionToTool_B_fkey" FOREIGN KEY ("B") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
