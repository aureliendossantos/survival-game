/*
  Warnings:

  - You are about to drop the column `characterId` on the `BuiltStructure` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Cell` table. All the data in the column will be lost.
  - The primary key for the `Character` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Item` table. All the data in the column will be lost.
  - The primary key for the `Terrain` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Terrain` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Terrain` table. All the data in the column will be lost.
  - Added the required column `title` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Terrain` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BuiltStructure" DROP CONSTRAINT "BuiltStructure_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_type_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_characterId_fkey";

-- DropForeignKey
ALTER TABLE "_ActionToTerrain" DROP CONSTRAINT "_ActionToTerrain_B_fkey";

-- AlterTable
ALTER TABLE "BuiltStructure" DROP COLUMN "characterId";

-- AlterTable
ALTER TABLE "Cell" DROP COLUMN "type",
ADD COLUMN     "terrainId" TEXT NOT NULL DEFAULT E'plains';

-- AlterTable
ALTER TABLE "Character" DROP CONSTRAINT "Character_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Character_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Character_id_seq";

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "characterId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Terrain" DROP CONSTRAINT "Terrain_pkey",
DROP COLUMN "name",
DROP COLUMN "type",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT E'Plaines',
ADD CONSTRAINT "Terrain_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "_BuiltStructureToCharacter" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BuiltStructureToCharacter_AB_unique" ON "_BuiltStructureToCharacter"("A", "B");

-- CreateIndex
CREATE INDEX "_BuiltStructureToCharacter_B_index" ON "_BuiltStructureToCharacter"("B");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_terrainId_fkey" FOREIGN KEY ("terrainId") REFERENCES "Terrain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuiltStructureToCharacter" ADD FOREIGN KEY ("A") REFERENCES "BuiltStructure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuiltStructureToCharacter" ADD FOREIGN KEY ("B") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToTerrain" ADD FOREIGN KEY ("B") REFERENCES "Terrain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
