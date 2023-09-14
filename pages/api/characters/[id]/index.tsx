import { characterWithAllInfo } from "lib/api/types"
import getHoursSince from "lib/getHoursSince"
import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

async function getNewStamina(stamina: number, lastSet: Date) {
  const hoursSinceUpdate = getHoursSince(lastSet)
  return Math.min(stamina + hoursSinceUpdate, 10)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "GET")
    return res.status(405).json({ message: "Method not allowed" })
  const characterId = String(req.query.id)
  const characterCheck = await prisma.character.findUnique({
    where: { id: characterId },
    select: {
      stamina: true,
      lastStaminaSet: true,
    },
  })
  if (characterCheck == null)
    return res.status(404).json({ message: "Ce personnage est introuvable." })
  await updateStructures(characterId)
  const newStamina = await getNewStamina(
    characterCheck.stamina,
    characterCheck.lastStaminaSet
  )
  let character = await prisma.character.update({
    where: { id: characterId },
    data: { stamina: newStamina, lastStaminaSet: new Date() },
    include: characterWithAllInfo.include,
  })
  res.json({ character, cell: character.cell })
}

async function updateStructures(characterId: string) {
  const builtStructures = await prisma.builtStructure.findMany({
    where: {
      cell: {
        characters: {
          some: { id: { equals: characterId } },
        },
      },
    },
  })
  for (const builtStructure of builtStructures) {
    const now = new Date()
    const hoursSinceUpdate = getHoursSince(builtStructure.lastDurabilitySet)
    if (hoursSinceUpdate > 0) {
      const newDurability = Math.max(
        0,
        builtStructure.durability - hoursSinceUpdate
      )
      await prisma.builtStructure.updateMany({
        where: {
          id: builtStructure.id,
        },
        data: {
          durability: newDurability,
          lastDurabilitySet: now,
        },
      })
    }
  }
}
