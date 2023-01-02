import prisma from "lib/prisma"

import { actions } from "data/actions"
import { terrains } from "data/terrains"
import { materials, tools } from "data/items"
import { structures } from "data/structures"

/**
 * Create all items and other data needed to start the game.
 */
export default async function createDefaultData() {
  await prisma.terrain.createMany({
    data: terrains,
    skipDuplicates: true,
  })
  await prisma.material.createMany({
    data: materials,
    skipDuplicates: true,
  })
  await prisma.tool.createMany({
    data: tools,
    skipDuplicates: true,
  })
  // Prisma's .createMany does not support nested creates, so we use .create here
  await Promise.all(
    structures.map(async (structure) => {
      await prisma.structure.create({ data: structure })
    })
  )
  await Promise.all(
    actions.map(async (action) => {
      await prisma.action.create({ data: action })
    })
  )
}
