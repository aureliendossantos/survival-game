import { BuiltStructure, FoodInstance, Prisma } from "@prisma/client"
import { characterWithAllInfo } from "lib/api/types"
import getHoursSince from "lib/getHoursSince"
import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * @swagger
 * /api/characters/{id}:
 *   get:
 *     description: "Updates the stamina of the character, the durability of the food in their inventory and the durability of the built structures on their current cell before returning all data about the character, including the cell."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "The ID of the character."
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *       404:
 *        description: "The character was not found."
 *        content:
 *          application/json:
 *            schema:
 *             type: object
 *             properties:
 *              message:
 *               type: string
 *               description: "The error message."
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == "OPTIONS") return res.status(200).json({ message: "ok" })
  if (req.method != "GET")
    return res.status(405).json({ message: "Method not allowed" })
  const characterId = String(req.query.id)
  const character = await prisma.character.findUnique({
    where: { id: characterId },
    include: {
      inventory: { select: { food: true } },
      cell: { select: { builtStructures: true } },
    },
  })
  if (character == null)
    return res.status(404).json({ message: "Ce personnage est introuvable." })
  await updateFood(character.inventory.food)
  await updateStructures(character.cell.builtStructures)
  const { newAttr: newStamina, now: staminaSet } = updateAttribute(
    character.stamina,
    character.lastStaminaSet,
    1,
    10,
  )
  const { newAttr: newHunger, now: hungerSet } = updateAttribute(
    character.hunger,
    character.lastHungerSet,
    -1,
    10,
  )
  const updatedCharacter = await prisma.character.update({
    where: { id: characterId },
    data: {
      stamina: newStamina,
      lastStaminaSet: staminaSet,
      hunger: newHunger,
      lastHungerSet: hungerSet,
    },
    include: characterWithAllInfo.include,
  })
  // TODO: remove cell from the response
  res.json({ character: updatedCharacter, cell: updatedCharacter.cell })
}

/**
 * Takes the durability for any kind of item and decreases it by 1 for each hour that has passed since the last durability update.
 * @param attr The current attribute.
 * @param lastSet The last time the attribute was updated.
 * @param hourMultiplier Applied to the number of hours since the last update.
 * @param max Should be set if the multiplier is positive.
 * @returns `newAttr`: The new attribute value, or `undefined` if the attribute should not be updated. `now`: The date at which the new attribute was calculated.
 */
function updateAttribute(
  attr: number,
  lastSet: Date,
  hourMultiplier = -1,
  max?: number,
) {
  const now = new Date()
  const hoursSinceUpdate = getHoursSince(lastSet)
  if (hoursSinceUpdate > 0) {
    let newAttr = Math.max(0, attr + hoursSinceUpdate * hourMultiplier)
    if (max) newAttr = Math.min(max, newAttr)
    return { newAttr, now }
  }
  // No update needed
  return { newAttr: undefined, now: undefined }
}

async function updateFood(foodInstances: FoodInstance[]) {
  for (const foodInstance of foodInstances) {
    const { newAttr: newDurability, now } = updateAttribute(
      foodInstance.durability,
      foodInstance.lastDurabilitySet,
    )
    if (newDurability) {
      if (newDurability == 0) {
        await prisma.foodInstance.delete({
          where: { id: foodInstance.id },
        })
      } else {
        await prisma.foodInstance.update({
          where: { id: foodInstance.id },
          data: {
            durability: newDurability,
            lastDurabilitySet: now,
          },
        })
      }
    }
  }
}

async function updateStructures(builtStructures: BuiltStructure[]) {
  for (const builtStructure of builtStructures) {
    const { newAttr: newDurability, now } = updateAttribute(
      builtStructure.durability,
      builtStructure.lastDurabilitySet,
    )
    if (newDurability) {
      await prisma.builtStructure.update({
        where: { id: builtStructure.id },
        data: {
          durability: newDurability,
          lastDurabilitySet: now,
        },
      })
    }
  }
}
