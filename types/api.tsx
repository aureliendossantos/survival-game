import { Prisma } from "@prisma/client"

const terrainWithActions = Prisma.validator<Prisma.TerrainArgs>()({
  include: { actions: true },
})

export type TerrainWithActions = Prisma.TerrainGetPayload<
  typeof terrainWithActions
>

const builtStructureWithAllInfo = Prisma.validator<Prisma.BuiltStructureArgs>()(
  {
    include: {
      structure: {
        include: { actions: true },
      },
      contributors: true,
      modules: true,
    },
  }
)

export type BuiltStructureWithAllInfo = Prisma.BuiltStructureGetPayload<
  typeof builtStructureWithAllInfo
>

const structureWithAllInfo = Prisma.validator<Prisma.StructureArgs>()({
  include: {
    requiredItems: {
      include: { item: true },
    },
    modules: { select: { id: true } },
  },
})

export type StructureWithAllInfo = Prisma.StructureGetPayload<
  typeof structureWithAllInfo
>

const cellWithAllInfo = Prisma.validator<Prisma.CellArgs>()({
  include: {
    terrain: {
      include: { actions: true },
    },
    builtStructures: {
      include: {
        structure: {
          include: { actions: true },
        },
        contributors: true,
        modules: true,
      },
    },
  },
})

export type CellWithAllInfo = Prisma.CellGetPayload<typeof cellWithAllInfo>

const cellWithBuiltStructures = Prisma.validator<Prisma.CellArgs>()({
  select: {
    id: true,
    x: true,
    y: true,
    terrainId: true,
    builtStructures: true,
  },
})

export type CellWithBuiltStructures = Prisma.CellGetPayload<
  typeof cellWithBuiltStructures
>

const characterWithInventoryAndMap = Prisma.validator<Prisma.CharacterArgs>()({
  include: {
    inventory: {
      include: {
        item: true,
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

export type CharacterWithInventoryAndMap = Prisma.CharacterGetPayload<
  typeof characterWithInventoryAndMap
>
