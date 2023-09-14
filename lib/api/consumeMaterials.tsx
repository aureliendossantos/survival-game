import { StructureCost } from "@prisma/client"
import prisma from "lib/prisma"

export default async function consumeMaterials(
  costs: StructureCost[],
  inventoryId: string
) {
  for (const cost of costs) {
    await prisma.posessedMaterial.update({
      where: {
        inventoryId_materialId: {
          inventoryId: inventoryId,
          materialId: cost.materialId,
        },
      },
      data: { quantity: { decrement: cost.quantity } },
    })
  }
}
