import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

function getDate() {
  const now = new Date()
  return now.toLocaleDateString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "DELETE") {
    // Delete everything in the right order
    console.log(getDate() + " start deleting...")
    await prisma.actionLoot.deleteMany()
    await prisma.structureCost.deleteMany()
    await prisma.inventory.deleteMany()
    await prisma.builtStructure.deleteMany()
    await prisma.structure.deleteMany()
    await prisma.action.deleteMany()
    await prisma.item.deleteMany()
    await prisma.character.deleteMany()
    await prisma.cell.deleteMany()
    await prisma.terrain.deleteMany()
    await prisma.map.deleteMany()
    await prisma.user.deleteMany()
    console.log(getDate() + " deleted 12 tables.")
    res.json({
      success: true,
      message: "Tables vidées. (" + getDate() + ")",
    })
  } else if (req.method == "POST") {
    // Create data
    console.log(getDate() + " start inserting...")
    const terrains = [
      { id: "plains", title: "Plaines" },
      {
        id: "beach",
        title: "Plage",
        description: "Une bande de sable qui réchauffe les pieds.",
      },
      {
        id: "forest",
        title: "Forêt",
        description: "Une forêt vierge à la végétation luxuriante.",
        stamina: -1,
      },
      {
        id: "mountains",
        title: "Montagnes",
        description: "Des pics escarpés.",
        stamina: -2,
      },
      {
        id: "sea",
        title: "Mer",
        description: "Si seulement c'était possible de la traverser...",
      },
    ]
    await Promise.all(
      terrains.map(async (terrain) => {
        await prisma.terrain.create({ data: terrain })
      })
    )
    console.log(getDate() + " created terrains.")
    const items = [
      { id: 1, title: "Branchages" },
      { id: 2, title: "Feuillages" },
      { id: 3, title: "Galets" },
      { id: 4, title: "Coquillages" },
      { id: 5, title: "Marteau" },
    ]
    await Promise.all(
      items.map(async (item) => {
        await prisma.item.create({ data: item })
      })
    )
    console.log(getDate() + " created items.")
    const structures = [
      {
        id: 1,
        title: "Campement",
        description: "Un campement rudimentaire pour reprendre des forces.",
        minDurability: 60,
        maxDurability: 120,
        requiredItems: {
          create: [
            { itemId: 1, quantity: 20 },
            { itemId: 2, quantity: 10 },
          ],
        },
        modules: {
          create: [
            {
              id: 2,
              title: "Établi",
              description: "Pour confectionner des outils simples.",
              minDurability: 20,
              maxDurability: 40,
              requiredItems: {
                create: [
                  { itemId: 1, quantity: 15 },
                  { itemId: 3, quantity: 10 },
                ],
              },
            },
          ],
        },
      },
    ]
    await Promise.all(
      structures.map(async (structure) => {
        await prisma.structure.create({ data: structure })
      })
    )
    console.log(getDate() + " created structures.")
    const actions = [
      {
        title: "Ramasser du bois",
        description: "Récupérer des branchages et de la verdure à la main.",
        stamina: -1,
        successMessage: "Vous avez trouvé $1 branchages et $2 feuillages.",
        terrains: { connect: { id: "forest" } },
        loot: {
          create: [
            { itemId: 1, minQuantity: 6, maxQuantity: 10 },
            { itemId: 2, minQuantity: 3, maxQuantity: 5 },
          ],
        },
      },
      {
        title: "Ramasser des coquillages",
        description: "Récupérer des galets et des coquillages à la main.",
        stamina: -1,
        successMessage: "Vous avez trouvé $1 galets et $2 coquillages.",
        terrains: { connect: { id: "beach" } },
        loot: {
          create: [
            { itemId: 3, minQuantity: 2, maxQuantity: 5 },
            { itemId: 4, minQuantity: 2, maxQuantity: 3 },
          ],
        },
      },
      {
        title: "Se reposer",
        description: "Se reposer au campement pour récupérer de l'énergie.",
        stamina: 5,
        successMessage: "Vous vous êtes reposé.",
        structure: { connect: { id: 1 } },
      },
      {
        title: "Confectionner un marteau",
        description: "Il ne sert à rien pour l'instant...",
        stamina: -2,
        probability: 60,
        successMessage: "Vous avez confectionné un marteau.",
        failureMessage:
          "En essayant de confectionner un marteau, vous avez cassé vos matériaux !",
        structure: { connect: { id: 2 } },
        loot: {
          create: { itemId: 5, minQuantity: 1, maxQuantity: 1 },
        },
      },
    ]
    await Promise.all(
      actions.map(async (action) => {
        await prisma.action.create({ data: action })
      })
    )
    console.log(getDate() + " created actions. Finished.")
    res.json({
      success: true,
      message: "Tables remplies. (" + getDate() + ")",
    })
  } else {
    return res.status(405).json({ message: "Bad method" })
  }
}
