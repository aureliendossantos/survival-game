-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stamina" INTEGER NOT NULL DEFAULT 10,
    "lastStaminaSet" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mapId" INTEGER NOT NULL DEFAULT 1,
    "x" INTEGER NOT NULL DEFAULT 1,
    "y" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "pluralTitle" TEXT,
    "description" TEXT,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
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
    "toolId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "ToolInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "characterId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Map" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cell" (
    "id" TEXT NOT NULL,
    "mapId" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "terrainId" TEXT NOT NULL DEFAULT 'plains',

    CONSTRAINT "Cell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Terrain" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Plaines',
    "description" TEXT,
    "stamina" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Terrain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuiltStructure" (
    "id" TEXT NOT NULL,
    "durability" INTEGER NOT NULL,
    "lastDurabilitySet" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cellId" TEXT NOT NULL,
    "structureId" TEXT NOT NULL,
    "moduleOfId" TEXT,

    CONSTRAINT "BuiltStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Structure" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "minDurability" INTEGER NOT NULL DEFAULT 30,
    "maxDurability" INTEGER NOT NULL DEFAULT 40,
    "requiredStamina" INTEGER NOT NULL DEFAULT -1,
    "repairStamina" INTEGER NOT NULL DEFAULT -1,
    "repairAmount" INTEGER NOT NULL DEFAULT 20,
    "moduleOfId" TEXT,
    "upgradeOfId" TEXT,

    CONSTRAINT "Structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StructureCost" (
    "materialId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "structureId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StructureRepairCost" (
    "materialId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "structureId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Action" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "stamina" INTEGER NOT NULL DEFAULT 0,
    "probability" INTEGER NOT NULL DEFAULT 100,
    "successMessage" TEXT NOT NULL DEFAULT 'Vous avez réussi !',
    "failureMessage" TEXT DEFAULT 'Vous avez échoué.',
    "structureId" TEXT,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionCost" (
    "materialId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "actionId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ActionLoot" (
    "materialId" TEXT NOT NULL,
    "minQuantity" INTEGER NOT NULL DEFAULT 1,
    "maxQuantity" INTEGER NOT NULL DEFAULT 1,
    "actionId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ActionToolLoot" (
    "toolId" TEXT NOT NULL,
    "minQuantity" INTEGER NOT NULL DEFAULT 1,
    "maxQuantity" INTEGER NOT NULL DEFAULT 1,
    "actionId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BuiltStructureToCharacter" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_StructureToTool" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_StructureRepairTools" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ActionToTool" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ActionToTerrain" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_characterId_materialId_key" ON "Inventory"("characterId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "Cell_mapId_x_y_key" ON "Cell"("mapId", "x", "y");

-- CreateIndex
CREATE UNIQUE INDEX "StructureCost_structureId_materialId_key" ON "StructureCost"("structureId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "StructureRepairCost_structureId_materialId_key" ON "StructureRepairCost"("structureId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "ActionCost_actionId_materialId_key" ON "ActionCost"("actionId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "ActionLoot_actionId_materialId_key" ON "ActionLoot"("actionId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "ActionToolLoot_actionId_toolId_key" ON "ActionToolLoot"("actionId", "toolId");

-- CreateIndex
CREATE UNIQUE INDEX "_BuiltStructureToCharacter_AB_unique" ON "_BuiltStructureToCharacter"("A", "B");

-- CreateIndex
CREATE INDEX "_BuiltStructureToCharacter_B_index" ON "_BuiltStructureToCharacter"("B");

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

-- CreateIndex
CREATE UNIQUE INDEX "_ActionToTerrain_AB_unique" ON "_ActionToTerrain"("A", "B");

-- CreateIndex
CREATE INDEX "_ActionToTerrain_B_index" ON "_ActionToTerrain"("B");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_mapId_x_y_fkey" FOREIGN KEY ("mapId", "x", "y") REFERENCES "Cell"("mapId", "x", "y") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolInstance" ADD CONSTRAINT "ToolInstance_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolInstance" ADD CONSTRAINT "ToolInstance_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_terrainId_fkey" FOREIGN KEY ("terrainId") REFERENCES "Terrain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuiltStructure" ADD CONSTRAINT "BuiltStructure_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "Cell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuiltStructure" ADD CONSTRAINT "BuiltStructure_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuiltStructure" ADD CONSTRAINT "BuiltStructure_moduleOfId_fkey" FOREIGN KEY ("moduleOfId") REFERENCES "BuiltStructure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "ActionCost" ADD CONSTRAINT "ActionCost_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionLoot" ADD CONSTRAINT "ActionLoot_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionLoot" ADD CONSTRAINT "ActionLoot_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionToolLoot" ADD CONSTRAINT "ActionToolLoot_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionToolLoot" ADD CONSTRAINT "ActionToolLoot_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuiltStructureToCharacter" ADD CONSTRAINT "_BuiltStructureToCharacter_A_fkey" FOREIGN KEY ("A") REFERENCES "BuiltStructure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuiltStructureToCharacter" ADD CONSTRAINT "_BuiltStructureToCharacter_B_fkey" FOREIGN KEY ("B") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_ActionToTerrain" ADD CONSTRAINT "_ActionToTerrain_A_fkey" FOREIGN KEY ("A") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToTerrain" ADD CONSTRAINT "_ActionToTerrain_B_fkey" FOREIGN KEY ("B") REFERENCES "Terrain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
