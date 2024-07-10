import prisma from "lib/prisma"

import { actions } from "data/actions"
import { terrains } from "data/terrains"
import { materials, food, tools } from "data/items"
import { structures } from "data/structures"

/**
 * Create all items and other data needed to start the game.
 */
export default async function createDefaultData() {
  console.log("Populating Terrain...")
  await prisma.terrain.createMany({
    data: terrains,
    skipDuplicates: true,
  })
  console.log("Populating Material...")
  await prisma.material.createMany({
    data: materials,
    skipDuplicates: true,
  })
  console.log("Populating Food...")
  await prisma.food.createMany({
    data: food,
    skipDuplicates: true,
  })
  console.log("Populating Tool...")
  await prisma.tool.createMany({
    data: tools,
    skipDuplicates: true,
  })
  // Prisma's .createMany does not support nested creates, so we use upsert,
  // which is a create that can skip duplicates.
  console.log("Populating Structure...")
  await Promise.all(
    structures.map(async (structure) => {
      await prisma.structure.upsert({
        where: { id: structure.id },
        create: structure,
        update: {},
      })
    }),
  )
  console.log("Populating Action...")
  await Promise.all(
    actions.map(async (action) => {
      await prisma.action.upsert({
        where: { id: action.id },
        create: action,
        update: {},
      })
    }),
  )
}
