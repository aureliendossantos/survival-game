import prisma from "lib/prisma"

/**
 * Delete all database tables in the right order to avoid conflicts.
 */
export default async function deleteAllData() {
  await prisma.actionLoot.deleteMany()
  await prisma.actionFoodLoot.deleteMany()
  await prisma.actionToolLoot.deleteMany()
  await prisma.actionCost.deleteMany()
  await prisma.structureCost.deleteMany()
  await prisma.structureRepairCost.deleteMany()
  await prisma.user.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.structure.deleteMany()
  await prisma.action.deleteMany()
  await prisma.material.deleteMany()
  await prisma.food.deleteMany()
  await prisma.tool.deleteMany()
  await prisma.map.deleteMany()
  await prisma.terrain.deleteMany()
  // Tables that should be emptied automatically (cascade delete) but better safe than sorry:
  await prisma.character.deleteMany()
  await prisma.foodInstance.deleteMany()
  await prisma.toolInstance.deleteMany()
  await prisma.posessedMaterial.deleteMany()
  await prisma.cell.deleteMany()
  await prisma.builtStructure.deleteMany()
}
