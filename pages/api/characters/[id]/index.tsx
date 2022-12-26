import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

async function updateStamina(characterId: string) {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
    select: {
      stamina: true,
      lastStaminaSet: true,
    },
  })
  const hoursSinceUpdate = getHoursSince(character.lastStaminaSet)
  return Math.min(character.stamina + hoursSinceUpdate, 10)
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }
  const characterId = String(req.query.id)
  await updateStructures(characterId)
  const newStamina = await updateStamina(characterId)
  let character = await prisma.character.update({
    where: { id: characterId },
    data: { stamina: newStamina, lastStaminaSet: new Date() },
    include: {
      inventory: {
        include: {
          item: {
            include: {
              inActionCost: {
                include: {
                  action: {
                    include: { requiredItems: { include: { item: true } } },
                  },
                },
              },
            },
          },
        },
      },
      map: {
        include: {
          cells: {
            select: {
              id: true,
              x: true,
              y: true,
              terrainId: true,
              builtStructures: true,
            },
          },
        },
      },
    },
  })
  character.inventory = character.inventory.filter(
    (entry) => entry.quantity > 0
  )
  const cell = await prisma.cell.findFirst({
    where: {
      characters: {
        some: { id: { equals: characterId } },
      },
    },
    include: {
      characters: true,
      terrain: {
        include: {
          actions: {
            include: { requiredItems: { include: { item: true } } },
          },
        },
      },
      builtStructures: {
        include: {
          structure: {
            include: {
              actions: {
                include: { requiredItems: { include: { item: true } } },
              },
            },
          },
          contributors: true,
          modules: true,
        },
      },
    },
  })
  res.json({ character, cell })
}

function getHoursSince(time: Date) {
  return Math.floor((new Date().getTime() - time.getTime()) / 3.6e6)
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
  for (const [index, structure] of builtStructures.entries()) {
    const now = new Date()
    const hoursSinceUpdate = getHoursSince(structure.lastDurabilitySet)
    if (hoursSinceUpdate > 0) {
      const newDurability = Math.max(0, structure.durability - hoursSinceUpdate)
      await prisma.builtStructure.updateMany({
        where: {
          id: structure.id,
        },
        data: {
          durability: newDurability,
          lastDurabilitySet: now,
        },
      })
    }
  }
}
