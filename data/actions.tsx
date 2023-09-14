import { Prisma } from "@prisma/client"

export const actions = Prisma.validator<Prisma.ActionCreateInput[]>()([
  {
    id: 1,
    title: "Ramasser du bois",
    description: "Récupérer des branches et de la verdure à la main.",
    stamina: -1,
    successMessage: "Vous avez trouvé $1 branches et $2 feuillages.",
    terrains: { connect: { id: "forest" } },
    materials: {
      create: [
        { materialId: "branch", minQuantity: 6, maxQuantity: 10 },
        { materialId: "greenery", minQuantity: 3, maxQuantity: 5 },
      ],
    },
  },
  {
    id: 2,
    title: "Couper un arbre",
    description: "Couper un tronc d'arbre à la hache.",
    stamina: -1,
    successMessage: "Vous obtenez $1 tronc d'arbre.",
    terrains: { connect: { id: "forest" } },
    requiredTools: { connect: { id: "axe" } },
    materials: { create: { materialId: "trunk" } },
  },
  {
    id: 3,
    title: "Tailler des bûches",
    stamina: -2,
    successMessage: "Vous obtenez $1 bûches.",
    requiredMaterials: { create: { materialId: "trunk" } },
    requiredTools: { connect: { id: "axe" } },
    materials: {
      create: { materialId: "log", minQuantity: 6, maxQuantity: 10 },
    },
  },
  {
    id: 4,
    title: "Ramasser des galets",
    description: "Récupérer des galets et des coquillages à la main.",
    stamina: -1,
    successMessage: "Vous avez trouvé $1 galets et $2 coquillages.",
    terrains: { connect: { id: "beach" } },
    materials: {
      create: [
        { materialId: "stone", minQuantity: 2, maxQuantity: 5 },
        { materialId: "shell", minQuantity: 2, maxQuantity: 3 },
      ],
    },
  },
  {
    id: 5,
    title: "Se reposer",
    description: "Se reposer au campement pour récupérer de l'énergie.",
    stamina: 5,
    successMessage: "Vous vous êtes reposé.",
    structure: { connect: { id: "camp" } },
  },
  {
    id: 6,
    title: "Fabriquer un marteau",
    stamina: -2,
    probability: 60,
    successMessage: "Vous avez fabriqué un marteau.",
    failureMessage:
      "En essayant de fabriquer un marteau, vous avez cassé vos matériaux !",
    structure: { connect: { id: "workbench" } },
    requiredMaterials: {
      create: [{ materialId: "branch" }, { materialId: "stone", quantity: 2 }],
    },
    tools: { create: { toolId: "hammer" } },
  },
  {
    id: 7,
    title: "Fabriquer une hache",
    stamina: -2,
    probability: 90,
    successMessage: "Vous avez fabriqué une hache.",
    failureMessage:
      "En essayant de fabriquer une hache, vous avez cassé vos matériaux !",
    structure: { connect: { id: "workbench" } },
    requiredMaterials: {
      create: [
        { materialId: "branch", quantity: 2 },
        { materialId: "stone", quantity: 2 },
      ],
    },
    requiredTools: { connect: { id: "hammer" } },
    tools: { create: { toolId: "axe" } },
  },
  {
    id: 8,
    title: "Tailler une aiguille",
    stamina: 0,
    probability: 30,
    successMessage: "Vous avez taillé une aiguille dans la coquille.",
    failureMessage:
      "En essayant d'obtenir une aiguille, vous avez cassé la coquille !",
    requiredMaterials: { create: { materialId: "shell", quantity: 1 } },
    requiredTools: { connect: { id: "hammer" } },
    tools: { create: { toolId: "needle" } },
  },
  {
    id: 9,
    title: "Confectionner de la ficelle",
    stamina: -1,
    probability: 70,
    successMessage: "Vous avez confectionné de la ficelle.",
    failureMessage: "Vous avez cassé vos matériaux !",
    requiredMaterials: { create: { materialId: "greenery", quantity: 1 } },
    requiredTools: { connect: { id: "needle" } },
    materials: { create: { materialId: "string" } },
  },
  {
    id: 10,
    title: "Fabriquer un filet",
    stamina: -4,
    successMessage: "Vous avez fabriqué un filet.",
    structure: { connect: { id: "workbench" } },
    requiredMaterials: { create: { materialId: "string", quantity: 16 } },
    requiredTools: { connect: { id: "needle" } },
    materials: { create: { materialId: "string" } },
  },
  {
    id: 11,
    title: "Fabriquer une épuisette",
    stamina: -1,
    successMessage: "Vous avez fabriqué une épuisette.",
    structure: { connect: { id: "workbench" } },
    requiredMaterials: {
      create: [{ materialId: "branch", quantity: 3 }, { materialId: "net" }],
    },
    requiredTools: { connect: { id: "needle" } },
    tools: { create: { toolId: "fishingNet" } },
  },
])
