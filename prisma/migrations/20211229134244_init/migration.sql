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
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mapId" INTEGER NOT NULL DEFAULT 1,
    "x" INTEGER NOT NULL DEFAULT 1,
    "y" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "characterId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
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
    "type" TEXT NOT NULL DEFAULT E'plains',

    CONSTRAINT "Cell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Terrain" (
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'Plaines',
    "description" TEXT,

    CONSTRAINT "Terrain_pkey" PRIMARY KEY ("type")
);

-- CreateTable
CREATE TABLE "BuiltStructure" (
    "id" TEXT NOT NULL,
    "structureId" TEXT NOT NULL,
    "durability" INTEGER NOT NULL,
    "lastDurabilitySet" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "characterId" INTEGER NOT NULL,
    "cellId" TEXT NOT NULL,

    CONSTRAINT "BuiltStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Structure" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "minDurability" INTEGER NOT NULL DEFAULT 100,
    "maxDurability" INTEGER NOT NULL DEFAULT 100,
    "upgradeOf" TEXT,

    CONSTRAINT "Structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StructureCost" (
    "structureId" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "probability" INTEGER NOT NULL DEFAULT 100,
    "successMessage" TEXT NOT NULL DEFAULT E'Vous avez trouvé $1 unités.',
    "failureMessage" TEXT DEFAULT E'Vous n\'avez rien trouvé.',

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionLoot" (
    "actionId" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "minQuantity" INTEGER DEFAULT 0,
    "maxQuantity" INTEGER DEFAULT 0
);

-- CreateTable
CREATE TABLE "_ActionToTerrain" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_characterId_itemId_key" ON "Inventory"("characterId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Cell_mapId_x_y_key" ON "Cell"("mapId", "x", "y");

-- CreateIndex
CREATE UNIQUE INDEX "StructureCost_structureId_itemId_key" ON "StructureCost"("structureId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "ActionLoot_actionId_itemId_key" ON "ActionLoot"("actionId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "_ActionToTerrain_AB_unique" ON "_ActionToTerrain"("A", "B");

-- CreateIndex
CREATE INDEX "_ActionToTerrain_B_index" ON "_ActionToTerrain"("B");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_mapId_x_y_fkey" FOREIGN KEY ("mapId", "x", "y") REFERENCES "Cell"("mapId", "x", "y") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_type_fkey" FOREIGN KEY ("type") REFERENCES "Terrain"("type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuiltStructure" ADD CONSTRAINT "BuiltStructure_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuiltStructure" ADD CONSTRAINT "BuiltStructure_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuiltStructure" ADD CONSTRAINT "BuiltStructure_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "Cell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Structure" ADD CONSTRAINT "Structure_upgradeOf_fkey" FOREIGN KEY ("upgradeOf") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StructureCost" ADD CONSTRAINT "StructureCost_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StructureCost" ADD CONSTRAINT "StructureCost_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionLoot" ADD CONSTRAINT "ActionLoot_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionLoot" ADD CONSTRAINT "ActionLoot_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToTerrain" ADD FOREIGN KEY ("A") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToTerrain" ADD FOREIGN KEY ("B") REFERENCES "Terrain"("type") ON DELETE CASCADE ON UPDATE CASCADE;
