import { BuiltStructure, FoodInstance } from "@prisma/client"
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
  if (req.method != "GET")
    return res.status(405).json({ message: "Method not allowed" })
  const characterId = String(req.query.id)
  const character = await prisma.character.findUnique({
    where: { id: characterId },
    select: {
      stamina: true,
      lastStaminaSet: true,
      inventory: { select: { food: true } },
      cell: { select: { builtStructures: true } },
    },
  })
  if (character == null)
    return res.status(404).json({ message: "Ce personnage est introuvable." })
  await updateFood(character.inventory.food)
  await updateStructures(character.cell.builtStructures)
  const newStamina = getNewStamina(character.stamina, character.lastStaminaSet)
  let updatedCharacter = await prisma.character.update({
    where: { id: characterId },
    data: { stamina: newStamina, lastStaminaSet: new Date() },
    include: characterWithAllInfo.include,
  })
  res.json({ character: updatedCharacter, cell: updatedCharacter.cell })
}

/**
 * Calculates the new stamina of the character based on the last time it was updated.
 * @param stamina The current stamina of the character.
 * @param lastSet The last time the stamina was updated.
 * @returns The new stamina of the character.
 */
function getNewStamina(stamina: number, lastSet: Date) {
  const hoursSinceUpdate = getHoursSince(lastSet)
  return Math.min(stamina + hoursSinceUpdate, 10)
}

/**
 * Takes the durability for any kind of item and decreases it by 1 for each hour that has passed since the last durability update.
 * @param durability The `durability` parameter of an item.
 * @param lastDurabilitySet The `lastDurabilitySet` parameter of an item.
 * @returns `newDurability`: The new durability, or `false` if the durability should not be updated. `now`: The date at which the new durability was calculated.
 */
function updateDurability(durability: number, lastDurabilitySet: Date) {
  const now = new Date()
  const hoursSinceUpdate = getHoursSince(lastDurabilitySet)
  if (hoursSinceUpdate > 0) {
    return { newDurability: Math.max(0, durability - hoursSinceUpdate), now }
  }
  return { newDurability: false, now }
}

async function updateFood(foodInstances: FoodInstance[]) {
  for (const foodInstance of foodInstances) {
    const { newDurability, now } = updateDurability(
      foodInstance.durability,
      foodInstance.lastDurabilitySet,
    )
    if (newDurability !== false) {
      if (newDurability == 0) {
        await prisma.foodInstance.delete({
          where: { id: foodInstance.id },
        })
      } else {
        await prisma.foodInstance.update({
          where: { id: foodInstance.id },
          data: {
            durability: newDurability as number,
            lastDurabilitySet: now,
          },
        })
      }
    }
  }
}

async function updateStructures(builtStructures: BuiltStructure[]) {
  for (const builtStructure of builtStructures) {
    const { newDurability, now } = updateDurability(
      builtStructure.durability,
      builtStructure.lastDurabilitySet,
    )
    if (newDurability !== false) {
      await prisma.builtStructure.update({
        where: { id: builtStructure.id },
        data: {
          durability: newDurability as number,
          lastDurabilitySet: now,
        },
      })
    }
  }
}
