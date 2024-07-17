import { NextApiRequest, NextApiResponse } from "next"
import prisma from "lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == "OPTIONS") return res.status(200).json({ message: "ok" })
  if (req.method != "PATCH")
    return res.status(405).json({ message: "Bad method" })
  const character = await prisma.character.findUnique({
    where: { id: String(req.query.id) },
  })
  const foodInstance = await prisma.foodInstance.findUnique({
    where: { id: req.body.id },
    include: { food: true },
  })
  if (character.inventoryId != foodInstance.inventoryId)
    return res.json({
      success: false,
      message: "Cette nourriture n'est pas dans votre inventaire.",
    })
  const newHunger = Math.min(
    Math.max(character.hunger + foodInstance.food.satiety, 0),
    10,
  )
  const diff = newHunger - character.hunger
  await prisma.character.update({
    where: { id: character.id },
    data: { hunger: newHunger },
  })
  await prisma.foodInstance.delete({ where: { id: foodInstance.id } })
  return res.json({
    success: true,
    message:
      diff > 0
        ? `Vous avez récupéré ${diff} point${diff > 1 ? "s" : ""} de faim.`
        : "Vous avez mangé même si vous n'aviez pas faim.",
  })
}
