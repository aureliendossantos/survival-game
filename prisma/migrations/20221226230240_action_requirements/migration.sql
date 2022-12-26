-- AlterTable
ALTER TABLE "Action" ALTER COLUMN "successMessage" SET DEFAULT 'Vous avez réussi !',
ALTER COLUMN "failureMessage" SET DEFAULT 'Vous avez échoué.';

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "pluralTitle" TEXT;

-- CreateTable
CREATE TABLE "ActionCost" (
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "actionId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ActionCost_actionId_itemId_key" ON "ActionCost"("actionId", "itemId");

-- AddForeignKey
ALTER TABLE "ActionCost" ADD CONSTRAINT "ActionCost_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionCost" ADD CONSTRAINT "ActionCost_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
