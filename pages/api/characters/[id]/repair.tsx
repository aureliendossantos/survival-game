import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != "PATCH")
    return res.status(405).json({ message: "Bad method" })
  const characterId = String(req.query.id)
  const builtStructureId: string = req.body.id
  // L'inventaire contient-il les ressources requises ?
  const builtStructure = await prisma.builtStructure.findUnique({
    where: { id: builtStructureId },
    include: { structure: { include: { repairMaterials: true } } },
  })
  let requirementsMet = true
  for (const requirement of builtStructure.structure.repairMaterials) {
    const test = await prisma.inventory.findMany({
      where: {
        AND: [
          { characterId: characterId },
          { itemId: requirement.itemId },
          { quantity: { gte: requirement.quantity } },
        ],
      },
    })
    if (test.length == 0) requirementsMet = false
  }
  if (!requirementsMet)
    return res.json({
      success: false,
      message: "Vous n'avez pas assez de ressources.",
    })
  // Retirer les ressources de l'inventaire
  for (const requirement of builtStructure.structure.repairMaterials) {
    await prisma.inventory.update({
      where: {
        characterId_itemId: {
          characterId: characterId,
          itemId: requirement.itemId,
        },
      },
      data: { quantity: { decrement: requirement.quantity } },
    })
  }
  // Réparer la structure
  await prisma.builtStructure.update({
    where: {
      id: builtStructure.id,
    },
    data: {
      durability: Math.min(
        builtStructure.durability + builtStructure.structure.repairAmount,
        builtStructure.structure.maxDurability
      ),
      contributors: { connect: { id: characterId } },
    },
  })
  return res.json({
    success: true,
    message: `Vous avez réparé un ${builtStructure.structure.title}.`,
  })
}
