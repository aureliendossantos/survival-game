import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async (req, res) => {
  if (req.method == 'GET') {
    const query = await prisma.inventory.findMany({
      where: { characterId: req.query.id },
      select: {
        item: {
          select: { id: true, name: true }
        },
        quantity: true
      }
    })
    res.json(query)
  }
  if (req.method == 'PATCH') {
    const query = await prisma.inventory.update({
      where: {
        characterId_itemId: {
          characterId: req.query.id,
          itemId: req.body.id
        }
      },
      data: { quantity: { increment: req.body.quantity } }
    })
    res.json(query)
  }
}
