import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min
}

export default async (req, res) => {
  if (req.method == 'PATCH') {
    const characterId = req.query.id
    const action = await prisma.action.findUnique({
      where: { id: req.body.id },
      include: { loot: true }
    })
    if (action.probability >= randomInt(0, 100)) {
      for (const [index, loot] of action.loot.entries()) {
        const quantity = randomInt(loot.minQuantity, loot.maxQuantity)
        await prisma.inventory.upsert({
          where: {
            characterId_itemId: {
              characterId: characterId,
              itemId: loot.itemId
            }
          },
          update: { quantity: { increment: quantity } },
          create: {
            characterId: characterId,
            itemId: loot.itemId,
            quantity: quantity
          }
        })
        action.successMessage = action.successMessage.replace('$'+(index+1), quantity)
      }
      res.json({
        success: true,
        message: action.successMessage
      })
    } else {
      res.json({
        success: false,
        message: action.failureMessage
      })
    }
  } else {
    return res.status(405).json({ message: 'Bad method' })
  }
}
