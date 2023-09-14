-- DropForeignKey
ALTER TABLE "BuiltStructure" DROP CONSTRAINT "BuiltStructure_cellId_fkey";

-- DropForeignKey
ALTER TABLE "BuiltStructure" DROP CONSTRAINT "BuiltStructure_moduleOfId_fkey";

-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_mapId_fkey";

-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_userId_fkey";

-- DropForeignKey
ALTER TABLE "FoodInstance" DROP CONSTRAINT "FoodInstance_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "PosessedMaterial" DROP CONSTRAINT "PosessedMaterial_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "ToolInstance" DROP CONSTRAINT "ToolInstance_inventoryId_fkey";

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodInstance" ADD CONSTRAINT "FoodInstance_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolInstance" ADD CONSTRAINT "ToolInstance_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosessedMaterial" ADD CONSTRAINT "PosessedMaterial_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuiltStructure" ADD CONSTRAINT "BuiltStructure_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "Cell"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuiltStructure" ADD CONSTRAINT "BuiltStructure_moduleOfId_fkey" FOREIGN KEY ("moduleOfId") REFERENCES "BuiltStructure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
