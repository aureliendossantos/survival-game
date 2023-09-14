import consumeMaterials from "lib/api/consumeMaterials"
import consumeStamina from "lib/api/consumeStamina"
import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "PATCH") {
    const characterId = String(req.query.id)
    const structureId = req.body.id
    const parentBuiltStructureId = req.body.parentId
      ? String(req.body.parentId)
      : null
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    })
    const structure = await prisma.structure.findUnique({
      where: { id: structureId },
      include: { requiredMaterials: true },
    })
    // Le personnage a-t-il assez d'énergie ?
    if (character.stamina < -structure.requiredStamina) {
      return res.json({
        success: false,
        message: "Vous êtes trop fatigué.",
      })
    }
    // L'inventaire contient-il les ressources requises ?
    let requirementsMet = true
    for (const requirement of structure.requiredMaterials) {
      const test = await prisma.posessedMaterial.findFirst({
        where: {
          AND: [
            { inventoryId: character.inventoryId },
            { materialId: requirement.materialId },
            { quantity: { gte: requirement.quantity } },
          ],
        },
      })
      if (!test) requirementsMet = false
    }
    if (requirementsMet) {
      consumeStamina(structure.requiredStamina, character)
      consumeMaterials(structure.requiredMaterials, character.inventoryId)
      // Construire la structure
      const cell = await prisma.cell.findFirst({
        where: {
          characters: { some: { id: { equals: characterId } } },
        },
      })
      await prisma.builtStructure.create({
        data: {
          structure: { connect: { id: structure.id } },
          durability: randomInt(
            structure.minDurability,
            structure.maxDurability
          ),
          cell: { connect: { id: cell.id } },
          moduleOf: parentBuiltStructureId
            ? { connect: { id: parentBuiltStructureId } }
            : undefined,
          contributors: { connect: { id: characterId } },
          inventory: structure.hasInventory ? { create: {} } : undefined,
        },
      })
      return res.json({
        success: true,
        message: `Vous avez construit un ${structure.title}.`,
      })
    } else {
      return res.json({
        success: false,
        message: "Vous n'avez pas assez de ressources.",
      })
    }
  }
  return res.status(405).json({ message: "Bad method" })
}
