/*
  Warnings:

  - You are about to drop the column `upgradeOf` on the `Structure` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Structure" DROP CONSTRAINT "Structure_upgradeOf_fkey";

-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "stamina" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "structureId" INTEGER;

-- AlterTable
ALTER TABLE "BuiltStructure" ADD COLUMN     "moduleOfId" TEXT;

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "lastStaminaSet" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "stamina" INTEGER NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE "Structure" DROP COLUMN "upgradeOf",
ADD COLUMN     "moduleOfId" INTEGER,
ADD COLUMN     "upgradeOfId" INTEGER;

-- AlterTable
ALTER TABLE "Terrain" ADD COLUMN     "stamina" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "BuiltStructure" ADD CONSTRAINT "BuiltStructure_moduleOfId_fkey" FOREIGN KEY ("moduleOfId") REFERENCES "BuiltStructure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Structure" ADD CONSTRAINT "Structure_moduleOfId_fkey" FOREIGN KEY ("moduleOfId") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Structure" ADD CONSTRAINT "Structure_upgradeOfId_fkey" FOREIGN KEY ("upgradeOfId") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
