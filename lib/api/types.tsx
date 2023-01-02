import { Prisma } from "@prisma/client"

const terrainWithActions = Prisma.validator<Prisma.TerrainArgs>()({
  include: { actions: true },
})

export type TerrainWithActions = Prisma.TerrainGetPayload<
  typeof terrainWithActions
>

const actionWithRequirements = Prisma.validator<Prisma.ActionArgs>()({
  include: {
    requiredMaterials: { include: { material: true } },
    requiredTools: true,
  },
})

export type ActionWithRequirements = Prisma.ActionGetPayload<
  typeof actionWithRequirements
>

const builtStructureWithAllInfo = Prisma.validator<Prisma.BuiltStructureArgs>()(
  {
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

const cellWithAllInfo = Prisma.validator<Prisma.CellArgs>()({
  include: {
    characters: true,
    terrain: {
      include: {
        actions: {
          include: {
            requiredMaterials: { include: { material: true } },
            requiredTools: true,
          },
        },
      },
    },
    builtStructures: {
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

const toolInstanceWithAllInfo = Prisma.validator<Prisma.ToolInstanceArgs>()({
  include: { tool: true },
})

export type ToolInstanceWithAllInfo = Prisma.ToolInstanceGetPayload<
  typeof toolInstanceWithAllInfo
>

const characterWithAllInfo = Prisma.validator<Prisma.CharacterArgs>()({
  include: {
    tools: {
      include: { tool: true },
    },
    inventory: {
      include: {
        material: {
          include: {
            inActionCost: {
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

export type CharacterWithAllInfo = Prisma.CharacterGetPayload<
  typeof characterWithAllInfo
>
