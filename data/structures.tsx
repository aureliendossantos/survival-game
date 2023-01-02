import { Prisma } from "@prisma/client"

export const structures = Prisma.validator<
  Prisma.StructureUncheckedCreateInput[]
>()([
  {
    id: "camp",
    title: "Campement",
    description: "Un campement rudimentaire pour reprendre des forces.",
    minDurability: 30,
    maxDurability: 60,
    requiredMaterials: {
      create: [
        { materialId: "branch", quantity: 20 },
        { materialId: "greenery", quantity: 10 },
      ],
    },
    repairMaterials: {
      create: [
        { materialId: "branch", quantity: 4 },
        { materialId: "greenery", quantity: 2 },
      ],
    },
    modules: {
      create: [
        {
          id: "workbench",
          title: "Établi",
          description: "Pour confectionner des outils simples.",
          requiredMaterials: {
            create: [
              { materialId: "branch", quantity: 15 },
              { materialId: "stone", quantity: 10 },
            ],
          },
          repairMaterials: {
            create: [
              { materialId: "branch", quantity: 2 },
              { materialId: "stone", quantity: 1 },
            ],
          },
          repairAmount: 10,
        },
      ],
    },
  },
])
