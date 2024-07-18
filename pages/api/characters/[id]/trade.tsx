import { NextApiRequest, NextApiResponse } from "next"
import prisma from "lib/prisma"
import { TradeQuery, TradeMaterial } from "components/Inventory"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == "OPTIONS") return res.status(200).json({ message: "ok" })
  if (req.method != "PATCH")
    return res.status(405).json({ message: "Bad method" })
  const body = req.body as TradeQuery
  const inventoryA = await prisma.inventory.findFirst({
    where: { character: { id: req.query.id as string } },
    include: { materials: true, food: true, tools: true },
  })
  const inventoryB = await prisma.inventory.findUnique({
    where: { id: body.targetInventoryId },
    include: { materials: true, food: true, tools: true },
  })
  if (!inventoryA || !inventoryB)
    return res.status(404).json({ message: "Inventaire introuvable." })
  const fromA = body.playerInventory
  const fromB = body.targetInventory
  // Removing items
  await removeMaterials(inventoryA.id, fromA.materials)
  await removeMaterials(inventoryB.id, fromB.materials)
  // Giving items
  await giveMaterials(inventoryA.id, fromB.materials)
  await giveMaterials(inventoryB.id, fromA.materials)
  // Changing food & tools inventoryId
  await prisma.foodInstance.updateMany({
    where: { id: { in: fromA.food.map((id) => id) } },
    data: { inventoryId: inventoryB.id },
  })
  await prisma.foodInstance.updateMany({
    where: { id: { in: fromB.food.map((id) => id) } },
    data: { inventoryId: inventoryA.id },
  })
  await prisma.toolInstance.updateMany({
    where: { id: { in: fromA.tools.map((id) => id) } },
    data: { inventoryId: inventoryB.id },
  })
  await prisma.toolInstance.updateMany({
    where: { id: { in: fromB.tools.map((id) => id) } },
    data: { inventoryId: inventoryA.id },
  })
  return res.json({
    success: true,
    message: "Échange effectué.",
  })
}

const removeMaterials = async (inventoryId: string, items: TradeMaterial[]) => {
  await prisma.inventory.update({
    where: { id: inventoryId },
    data: {
      materials: {
        updateMany: [
          ...items.map((item) => ({
            where: { materialId: item.id },
            data: { quantity: { decrement: item.amount } },
          })),
        ],
      },
    },
  })
}

const giveMaterials = async (inventoryId: string, items: TradeMaterial[]) => {
  // We need upsertMany instead of updateMany, but it's not available for now, hence this transaction of upserts
  await prisma.$transaction(
    items.map((item) =>
      prisma.posessedMaterial.upsert({
        where: {
          inventoryId_materialId: {
            inventoryId,
            materialId: item.id,
          },
        },
        update: { quantity: { increment: item.amount } },
        create: {
          inventoryId,
          materialId: item.id,
          quantity: item.amount,
        },
      }),
    ),
  )
}
