import { Prisma } from "@prisma/client"

const terrainWithActions = Prisma.validator<Prisma.TerrainArgs>()({
  include: { actions: true },
})

export type TerrainWithActions = Prisma.TerrainGetPayload<
  typeof terrainWithActions
>

const actionWithRequiredItems = Prisma.validator<Prisma.ActionArgs>()({
  include: { requiredItems: { include: { item: true } } },
})

export type ActionWithRequiredItems = Prisma.ActionGetPayload<
  typeof actionWithRequiredItems
>

const builtStructureWithAllInfo = Prisma.validator<Prisma.BuiltStructureArgs>()(
  {
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

export type CharacterWithInventoryAndMap = Prisma.CharacterGetPayload<
  typeof characterWithInventoryAndMap
>
