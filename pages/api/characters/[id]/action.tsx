import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != "PATCH") {
    return res.status(405).json({ message: "Bad method" })
  }
  const characterId = String(req.query.id)
  const character = await prisma.character.findUnique({
    where: { id: characterId },
  })
  const action = await prisma.action.findUnique({
    where: { id: req.body.id },
    include: { requiredItems: true, loot: true },
  })
  if (character.stamina < -action.stamina) {
    return res.json({
      success: false,
      message: "Vous êtes trop fatigué.",
    })
  }
  // L'inventaire contient-il les ressources requises ?
  let requirementsMet = true
  for (const requirement of action.requiredItems) {
    const test = await prisma.inventory.findMany({
      where: {
        AND: [
          { characterId: characterId },
          { itemId: requirement.itemId },
          { quantity: { gte: requirement.quantity } },
        ],
      },
    })
    if (test.length == 0) {
      requirementsMet = false
    }
  }
  if (!requirementsMet) {
    return res.json({
      success: false,
      message: "Vous n'avez pas assez de ressources.",
    })
  }
  // Retirer les ressources de l'inventaire
  for (const requirement of action.requiredItems) {
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
  // Vérification de la probabilité
  if (action.probability < randomInt(0, 100)) {
    return res.json({
      success: false,
      message: action.failureMessage,
    })
  }
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
}
