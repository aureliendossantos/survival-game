import prisma from "lib/prisma"

/**
 * Delete all database tables in the right order to avoid conflicts.
 */
export default async function deleteAllData() {
  await prisma.actionLoot.deleteMany()
  await prisma.actionToolLoot.deleteMany()
  await prisma.actionCost.deleteMany()
  await prisma.structureCost.deleteMany()
  await prisma.structureRepairCost.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.builtStructure.deleteMany()
  await prisma.structure.deleteMany()
  await prisma.action.deleteMany()
  await prisma.material.deleteMany()
  await prisma.toolInstance.deleteMany()
  await prisma.tool.deleteMany()
  await prisma.character.deleteMany()
  await prisma.cell.deleteMany()
  await prisma.terrain.deleteMany()
  await prisma.map.deleteMany()
  await prisma.user.deleteMany()
}
