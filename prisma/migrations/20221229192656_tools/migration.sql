/*
  Warnings:

  - Made the column `minQuantity` on table `ActionLoot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maxQuantity` on table `ActionLoot` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ActionCost" ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "ActionLoot" ALTER COLUMN "minQuantity" SET NOT NULL,
ALTER COLUMN "minQuantity" SET DEFAULT 1,
ALTER COLUMN "maxQuantity" SET NOT NULL,
ALTER COLUMN "maxQuantity" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "Tool" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "title" TEXT NOT NULL,
    "pluralTitle" TEXT,
    "durability" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolInstance" (
    "id" TEXT NOT NULL,
    "durability" INTEGER NOT NULL,
    "lastDurabilitySet" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "toolId" INTEGER NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "ToolInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionToolLoot" (
    "toolId" INTEGER NOT NULL,
    "minQuantity" INTEGER NOT NULL DEFAULT 1,
    "maxQuantity" INTEGER NOT NULL DEFAULT 1,
    "actionId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_StructureToTool" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_StructureRepairTools" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ActionToTool" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ActionToolLoot_actionId_toolId_key" ON "ActionToolLoot"("actionId", "toolId");

-- CreateIndex
CREATE UNIQUE INDEX "_StructureToTool_AB_unique" ON "_StructureToTool"("A", "B");

-- CreateIndex
CREATE INDEX "_StructureToTool_B_index" ON "_StructureToTool"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StructureRepairTools_AB_unique" ON "_StructureRepairTools"("A", "B");

-- CreateIndex
CREATE INDEX "_StructureRepairTools_B_index" ON "_StructureRepairTools"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ActionToTool_AB_unique" ON "_ActionToTool"("A", "B");

-- CreateIndex
CREATE INDEX "_ActionToTool_B_index" ON "_ActionToTool"("B");

-- AddForeignKey
ALTER TABLE "ToolInstance" ADD CONSTRAINT "ToolInstance_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolInstance" ADD CONSTRAINT "ToolInstance_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionToolLoot" ADD CONSTRAINT "ActionToolLoot_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "_ActionToTool" ADD CONSTRAINT "_ActionToTool_A_fkey" FOREIGN KEY ("A") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToTool" ADD CONSTRAINT "_ActionToTool_B_fkey" FOREIGN KEY ("B") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
