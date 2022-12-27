-- AlterTable
ALTER TABLE "Structure" ADD COLUMN     "repairAmount" INTEGER NOT NULL DEFAULT 20,
ALTER COLUMN "minDurability" SET DEFAULT 30,
ALTER COLUMN "maxDurability" SET DEFAULT 40;

-- CreateTable
CREATE TABLE "StructureRepairCost" (
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "structureId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StructureRepairCost_structureId_itemId_key" ON "StructureRepairCost"("structureId", "itemId");

-- AddForeignKey
ALTER TABLE "StructureRepairCost" ADD CONSTRAINT "StructureRepairCost_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StructureRepairCost" ADD CONSTRAINT "StructureRepairCost_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
