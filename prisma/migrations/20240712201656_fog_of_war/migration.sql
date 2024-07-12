-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "satiety" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "_FogOfWar" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FogOfWar_AB_unique" ON "_FogOfWar"("A", "B");

-- CreateIndex
CREATE INDEX "_FogOfWar_B_index" ON "_FogOfWar"("B");

-- AddForeignKey
ALTER TABLE "_FogOfWar" ADD CONSTRAINT "_FogOfWar_A_fkey" FOREIGN KEY ("A") REFERENCES "Cell"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FogOfWar" ADD CONSTRAINT "_FogOfWar_B_fkey" FOREIGN KEY ("B") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
