/*
  Warnings:

  - The primary key for the `Action` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Action` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Structure` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Structure` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `upgradeOf` column on the `Structure` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[actionId,itemId]` on the table `ActionLoot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[structureId,itemId]` on the table `StructureCost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_ActionToTerrain` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `actionId` on the `ActionLoot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `structureId` on the `BuiltStructure` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `structureId` on the `StructureCost` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_ActionToTerrain` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ActionLoot" DROP CONSTRAINT "ActionLoot_actionId_fkey";

-- DropForeignKey
ALTER TABLE "BuiltStructure" DROP CONSTRAINT "BuiltStructure_structureId_fkey";

-- DropForeignKey
ALTER TABLE "Structure" DROP CONSTRAINT "Structure_upgradeOf_fkey";

-- DropForeignKey
ALTER TABLE "StructureCost" DROP CONSTRAINT "StructureCost_structureId_fkey";

-- DropForeignKey
ALTER TABLE "_ActionToTerrain" DROP CONSTRAINT "_ActionToTerrain_A_fkey";

-- AlterTable
ALTER TABLE "Action" DROP CONSTRAINT "Action_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Action_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ActionLoot" DROP COLUMN "actionId",
ADD COLUMN     "actionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "BuiltStructure" DROP COLUMN "structureId",
ADD COLUMN     "structureId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Structure" DROP CONSTRAINT "Structure_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "upgradeOf",
ADD COLUMN     "upgradeOf" INTEGER,
ADD CONSTRAINT "Structure_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StructureCost" DROP COLUMN "structureId",
ADD COLUMN     "structureId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_ActionToTerrain" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ActionLoot_actionId_itemId_key" ON "ActionLoot"("actionId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "StructureCost_structureId_itemId_key" ON "StructureCost"("structureId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "_ActionToTerrain_AB_unique" ON "_ActionToTerrain"("A", "B");

-- AddForeignKey
ALTER TABLE "BuiltStructure" ADD CONSTRAINT "BuiltStructure_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Structure" ADD CONSTRAINT "Structure_upgradeOf_fkey" FOREIGN KEY ("upgradeOf") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StructureCost" ADD CONSTRAINT "StructureCost_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionLoot" ADD CONSTRAINT "ActionLoot_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToTerrain" ADD FOREIGN KEY ("A") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;
