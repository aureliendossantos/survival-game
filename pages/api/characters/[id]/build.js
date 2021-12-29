import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min
}

export default async (req, res) => {
  if (req.method == 'PATCH') {
    const characterId = req.query.id
    // L'inventaire contient-il les ressources requises ?
    const structure = await prisma.structure.findUnique({
      where: { id: req.body.id },
      include: { requiredItems: true }
    })
    let requirementsMet = true
    for (const requirement of structure.requiredItems) {
      const test = await prisma.inventory.findMany({
        where: {
          AND: [
            { characterId: characterId },
            { itemId: requirement.itemId },
            { quantity: { gt: requirement.quantity } }
          ]
        }
      })
      if (test.length == 0) { requirementsMet = false }
    }
    if (requirementsMet) {
      // Retirer les ressources de l'inventaire
      for (const requirement of structure.requiredItems) {
        await prisma.inventory.update({
          where: { characterId_itemId: {
              characterId: characterId,
              itemId: requirement.itemId
          } },
          data: { quantity: { decrement: requirement.quantity } }
        })
      }
      // Construire la structure
      const cell = await prisma.cell.findFirst({
        where: {
          characters: {
            some: {
              id: {
                equals: characterId
              }
            }
          }
        }
      })
      const builtStructure = await prisma.builtStructure.create({
        data: {
          structureId: structure.id,
          durability: randomInt(structure.minDurability, structure.maxDurability),
          cellId: cell.id
        }
      })
      await prisma.character.update({
        where: { id: characterId },
        data: {
          builtStructures: {
            connect: {
              id: builtStructure.id
            }
          }
        }
      })
      res.json({
        success: true,
        message: "Construit.",
        cell: builtStructure
      })
    } else {
      res.json({
        success: false,
        message: "Pas assez de ressources."
      })
    }
  } else {
    return res.status(405).json({ message: 'Bad method' })
  }
}
