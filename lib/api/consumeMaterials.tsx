import { Character, StructureCost } from "@prisma/client"
import prisma from "lib/prisma"

export default async function consumeMaterials(
  costs: StructureCost[],
  character: Character
) {
  for (const cost of costs) {
    await prisma.inventory.update({
      where: {
        characterId_materialId: {
          characterId: character.id,
          materialId: cost.materialId,
        },
      },
      data: { quantity: { decrement: cost.quantity } },
    })
  }
}
