-- AlterTable
ALTER TABLE "_ActionToTerrain" ADD CONSTRAINT "_ActionToTerrain_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ActionToTerrain_AB_unique";

-- AlterTable
ALTER TABLE "_ActionToTool" ADD CONSTRAINT "_ActionToTool_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ActionToTool_AB_unique";

-- AlterTable
ALTER TABLE "_BuiltStructureToCharacter" ADD CONSTRAINT "_BuiltStructureToCharacter_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_BuiltStructureToCharacter_AB_unique";

-- AlterTable
ALTER TABLE "_FogOfWar" ADD CONSTRAINT "_FogOfWar_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_FogOfWar_AB_unique";

-- AlterTable
ALTER TABLE "_StructureRepairTools" ADD CONSTRAINT "_StructureRepairTools_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_StructureRepairTools_AB_unique";

-- AlterTable
ALTER TABLE "_StructureToTool" ADD CONSTRAINT "_StructureToTool_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_StructureToTool_AB_unique";

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CharacterToStructure" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CharacterToStructure_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BookToStructure" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookToStructure_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BookToInventory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookToInventory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ActionToBook" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActionToBook_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ActionToCharacter" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActionToCharacter_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CharacterToStructure_B_index" ON "_CharacterToStructure"("B");

-- CreateIndex
CREATE INDEX "_BookToStructure_B_index" ON "_BookToStructure"("B");

-- CreateIndex
CREATE INDEX "_BookToInventory_B_index" ON "_BookToInventory"("B");

-- CreateIndex
CREATE INDEX "_ActionToBook_B_index" ON "_ActionToBook"("B");

-- CreateIndex
CREATE INDEX "_ActionToCharacter_B_index" ON "_ActionToCharacter"("B");

-- AddForeignKey
ALTER TABLE "_CharacterToStructure" ADD CONSTRAINT "_CharacterToStructure_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToStructure" ADD CONSTRAINT "_CharacterToStructure_B_fkey" FOREIGN KEY ("B") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToStructure" ADD CONSTRAINT "_BookToStructure_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToStructure" ADD CONSTRAINT "_BookToStructure_B_fkey" FOREIGN KEY ("B") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToInventory" ADD CONSTRAINT "_BookToInventory_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToInventory" ADD CONSTRAINT "_BookToInventory_B_fkey" FOREIGN KEY ("B") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToBook" ADD CONSTRAINT "_ActionToBook_A_fkey" FOREIGN KEY ("A") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToBook" ADD CONSTRAINT "_ActionToBook_B_fkey" FOREIGN KEY ("B") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToCharacter" ADD CONSTRAINT "_ActionToCharacter_A_fkey" FOREIGN KEY ("A") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToCharacter" ADD CONSTRAINT "_ActionToCharacter_B_fkey" FOREIGN KEY ("B") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
