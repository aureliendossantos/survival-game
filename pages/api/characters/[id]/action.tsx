import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "PATCH") {
    const characterId = String(req.query.id)
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    })
    const action = await prisma.action.findUnique({
      where: { id: req.body.id },
      include: { loot: true },
    })
    if (character.stamina < -action.stamina) {
      return res.json({
        success: false,
        message: "Vous êtes trop fatigué.",
      })
    }
    if (action.probability >= randomInt(0, 100)) {
      // for loop instead of map because of the await
      for (const [index, loot] of action.loot.entries()) {
        const quantity = randomInt(loot.minQuantity, loot.maxQuantity)
        await prisma.inventory.upsert({
          where: {
            characterId_itemId: {
              characterId: characterId,
              itemId: loot.itemId,
            },
          },
          update: { quantity: { increment: quantity } },
          create: {
            characterId: characterId,
            itemId: loot.itemId,
            quantity: quantity,
          },
        })
        action.successMessage = action.successMessage.replace(
          "$" + (index + 1),
          String(quantity)
        )
      }
      if (action.stamina != 0) {
        const newStamina = Math.min(
          Math.max(character.stamina + action.stamina, 0),
          10
        )
        await prisma.character.update({
          where: { id: characterId },
          data: { stamina: newStamina },
        })
      }
      return res.json({
        success: true,
        message: action.successMessage,
      })
    } else {
      return res.json({
        success: false,
        message: action.failureMessage,
      })
    }
  } else {
    return res.status(405).json({ message: "Bad method" })
  }
}
