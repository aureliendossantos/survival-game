import {
  Action,
  ActionCost,
  Tool,
  ActionLoot,
  ActionToolLoot,
  Character,
} from "@prisma/client"
import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { ActionWithRequirements } from "lib/api/types"
import consumeStamina from "lib/api/consumeStamina"

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
    include: {
      requiredMaterials: true,
      requiredTools: true,
      loot: true,
      toolLoot: { include: { tool: true } },
    },
  })
  // Le personnage a-t-il assez d'énergie ?
  if (character.stamina < -action.stamina) {
    return res.json({
      success: false,
      message: "Vous êtes trop fatigué.",
    })
  }
  // L'inventaire contient-il les matériaux et outils requis ?
  if (!(await requirementsMet(action, characterId))) {
    return res.json({
      success: false,
      message: "Vous n'avez pas assez de ressources.",
    })
  }
  // Retirer les matériaux de l'inventaire
  for (const requirement of action.requiredMaterials) {
    await prisma.inventory.update({
      where: {
        characterId_materialId: {
          characterId: characterId,
          materialId: requirement.materialId,
        },
      },
      data: { quantity: { decrement: requirement.quantity } },
    })
  }
  // User les outils et les détruire
  for (const requiredTool of action.requiredTools) {
    const toolInstance = await prisma.toolInstance.findFirst({
      where: {
        characterId: characterId,
        toolId: requiredTool.id,
      },
    })
    if (toolInstance.durability > 1) {
      await prisma.toolInstance.update({
        where: { id: toolInstance.id },
        data: { durability: { decrement: 1 }, lastDurabilitySet: new Date() },
      })
    } else {
      await prisma.toolInstance.delete({
        where: { id: toolInstance.id },
      })
    }
  }
  // Vérification de la probabilité
  if (action.probability < randomInt(0, 100)) {
    return res.json({
      success: false,
      message: action.failureMessage,
    })
  }
  // Donner le loot
  // for loop instead of map because of the await
  for (const [index, loot] of action.loot.entries()) {
    const quantity = randomInt(loot.minQuantity, loot.maxQuantity)
    await prisma.inventory.upsert({
      where: {
        characterId_materialId: {
          characterId: characterId,
          materialId: loot.materialId,
        },
      },
      update: { quantity: { increment: quantity } },
      create: {
        characterId: characterId,
        materialId: loot.materialId,
        quantity: quantity,
      },
    })
    action.successMessage = action.successMessage.replace(
      "$" + (index + 1),
      String(quantity)
    )
  }
  // Donner les outils lootés
  for (const toolLoot of action.toolLoot) {
    const tool = toolLoot.tool
    const quantity = randomInt(toolLoot.minQuantity, toolLoot.maxQuantity)
    for (const index of [...Array(quantity).keys()])
      await prisma.character.update({
        where: {
          id: characterId,
        },
        data: {
          tools: { create: { toolId: tool.id, durability: tool.durability } },
        },
      })
  }
  // Diminuer l'énergie
  await consumeStamina(action.stamina, character)
  return res.json({
    success: true,
    message: action.successMessage,
  })
}

async function requirementsMet(
  action: Action & {
    requiredMaterials: ActionCost[]
    requiredTools: Tool[]
  },
  characterId: string
) {
  for (const requirement of action.requiredMaterials) {
    const test = await prisma.inventory.findMany({
      where: {
        AND: [
          { characterId: characterId },
          { materialId: requirement.materialId },
          { quantity: { gte: requirement.quantity } },
        ],
      },
    })
    if (test.length == 0) return false
  }
  for (const requirement of action.requiredTools) {
    const test = await prisma.toolInstance.findMany({
      where: {
        AND: [{ characterId: characterId }, { toolId: requirement.id }],
      },
    })
    if (test.length == 0) return false
  }
  return true
}
