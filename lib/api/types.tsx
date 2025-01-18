import { Prisma } from "@prisma/client"

const terrainWithActions = Prisma.validator<Prisma.TerrainDefaultArgs>()({
  include: { actions: true },
})

export type TerrainWithActions = Prisma.TerrainGetPayload<
  typeof terrainWithActions
>

const actionWithRequirements = Prisma.validator<Prisma.ActionDefaultArgs>()({
  include: {
    requiredMaterials: { include: { material: true } },
    requiredTools: true,
  },
})

export type ActionWithRequirements = Prisma.ActionGetPayload<
  typeof actionWithRequirements
>

export const inventoryWithAllInfo =
  Prisma.validator<Prisma.InventoryDefaultArgs>()({
    include: {
      books: {
        orderBy: { order: "asc" },
        include: { actions: true, structures: true },
      },
      food: {
        orderBy: [{ food: { order: "asc" } }, { durability: "desc" }],
        include: { food: true },
      },
      tools: {
        orderBy: [{ tool: { order: "asc" } }, { durability: "desc" }],
        include: { tool: true },
      },
      materials: {
        orderBy: { material: { order: "asc" } },
        include: {
          material: {
            include: {
              inActionCost: {
                orderBy: { action: { id: "asc" } },
                include: {
                  action: {
                    include: {
                      requiredMaterials: { include: { material: true } },
                      requiredTools: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

export type InventoryWithAllInfo = Prisma.InventoryGetPayload<
  typeof inventoryWithAllInfo
>

export const builtStructureWithAllInfo =
  Prisma.validator<Prisma.BuiltStructureDefaultArgs>()({
    include: {
      structure: {
        include: {
          actions: {
            include: {
              requiredMaterials: { include: { material: true } },
              requiredTools: true,
            },
          },
          repairMaterials: { include: { material: true } },
        },
      },
      inventory: inventoryWithAllInfo,
      contributors: true,
      modules: true,
    },
  })

export type BuiltStructureWithAllInfo = Prisma.BuiltStructureGetPayload<
  typeof builtStructureWithAllInfo
>

const structureWithAllInfo = Prisma.validator<Prisma.StructureDefaultArgs>()({
  include: {
    requiredMaterials: {
      include: { material: true },
    },
    requiredTools: true,
    modules: { select: { id: true } },
  },
})

export type StructureWithAllInfo = Prisma.StructureGetPayload<
  typeof structureWithAllInfo
>

export const cellWithAllInfo = Prisma.validator<Prisma.CellDefaultArgs>()({
  include: {
    characters: true,
    terrain: {
      include: {
        actions: {
          orderBy: { id: "asc" },
          include: {
            requiredMaterials: { include: { material: true } },
            requiredTools: true,
          },
        },
      },
    },
    builtStructures: builtStructureWithAllInfo,
  },
})

export type CellWithAllInfo = Prisma.CellGetPayload<typeof cellWithAllInfo>

const cellWithBuiltStructures = Prisma.validator<Prisma.CellDefaultArgs>()({
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

const bookWithAllInfo = Prisma.validator<Prisma.BookDefaultArgs>()({
  include: { actions: true, structures: true },
})

export type BookWithAllInfo = Prisma.BookGetPayload<typeof bookWithAllInfo>

const foodInstanceWithAllInfo =
  Prisma.validator<Prisma.FoodInstanceDefaultArgs>()({
    include: { food: true },
  })

export type FoodInstanceWithAllInfo = Prisma.FoodInstanceGetPayload<
  typeof foodInstanceWithAllInfo
>

const toolInstanceWithAllInfo =
  Prisma.validator<Prisma.ToolInstanceDefaultArgs>()({
    include: { tool: true },
  })

export type ToolInstanceWithAllInfo = Prisma.ToolInstanceGetPayload<
  typeof toolInstanceWithAllInfo
>

export const characterWithAllInfo =
  Prisma.validator<Prisma.CharacterDefaultArgs>()({
    include: {
      inventory: inventoryWithAllInfo,
      canSeeCells: {
        select: {
          id: true,
          x: true,
          y: true,
          terrainId: true,
          builtStructures: true,
        },
      },
      cell: cellWithAllInfo,
      knownActions: actionWithRequirements,
      knownStructures: true,
    },
  })

export type CharacterWithAllInfo = Prisma.CharacterGetPayload<
  typeof characterWithAllInfo
>
