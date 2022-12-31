import { Prisma } from "@prisma/client"
import deleteAllTables from "lib/api/deleteAll"
import getDate from "lib/getDate"
import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "DELETE") {
    // Delete everything in the right order
    console.log(getDate() + " start deleting...")
    await deleteAllTables()
    console.log(getDate() + " deleted all tables.")
    res.json({
      success: true,
      message: "Tables vidées. (" + getDate() + ")",
    })
  } else if (req.method == "POST") {
    // Create data
    console.log(getDate() + " start inserting...")
    await prisma.terrain.createMany({
      data: [
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
      ],
      skipDuplicates: true,
    })
    console.log(getDate() + " created terrains.")
    await prisma.item.createMany({
      data: [
        { id: 1, title: "Branche" },
        { id: 2, title: "Tronc" },
        { id: 3, title: "Bûche" },
        { id: 10, title: "Feuillage" },
        { id: 11, title: "Ficelle" },
        { id: 20, title: "Galet" },
        { id: 30, title: "Coquillage" },
      ],
      skipDuplicates: true,
    })
    await prisma.tool.createMany({
      data: [
        { id: 1, title: "Marteau", pluralTitle: "Marteaux", durability: 6 },
        { id: 2, title: "Hache", durability: 13 },
        { id: 3, title: "Aiguille", durability: 17 },
      ],
      skipDuplicates: true,
    })
    console.log(getDate() + " created items.")
    const structures = [
      {
        id: 1,
        title: "Campement",
        description: "Un campement rudimentaire pour reprendre des forces.",
        minDurability: 30,
        maxDurability: 60,
        requiredItems: {
          create: [
            { itemId: 1, quantity: 20 },
            { itemId: 10, quantity: 10 },
          ],
        },
        repairMaterials: {
          create: [
            { itemId: 1, quantity: 4 },
            { itemId: 10, quantity: 2 },
          ],
        },
        modules: {
          create: [
            {
              id: 2,
              title: "Établi",
              description: "Pour confectionner des outils simples.",
              requiredItems: {
                create: [
                  { itemId: 1, quantity: 15 },
                  { itemId: 20, quantity: 10 },
                ],
              },
              repairMaterials: {
                create: [
                  { itemId: 1, quantity: 2 },
                  { itemId: 20, quantity: 1 },
                ],
              },
              repairAmount: 10,
            },
          ],
        },
      },
    ]
    // Prisma's .createMany does not support nested creates, so we use .create here
    await Promise.all(
      structures.map(async (structure) => {
        await prisma.structure.create({ data: structure })
      })
    )
    console.log(getDate() + " created structures.")
    const actions = Prisma.validator<Prisma.ActionCreateInput[]>()([
      {
        title: "Ramasser du bois",
        description: "Récupérer des branches et de la verdure à la main.",
        stamina: -1,
        successMessage: "Vous avez trouvé $1 branches et $2 feuillages.",
        terrains: { connect: { id: "forest" } },
        loot: {
          create: [
            { itemId: 1, minQuantity: 6, maxQuantity: 10 },
            { itemId: 10, minQuantity: 3, maxQuantity: 5 },
          ],
        },
      },
      {
        title: "Couper un arbre",
        description: "Couper un tronc d'arbre à la hache.",
        stamina: -1,
        successMessage: "Vous obtenez $1 tronc d'arbre.",
        terrains: { connect: { id: "forest" } },
        requiredTools: { connect: { id: 2 } },
        loot: { create: { itemId: 2 } },
      },
      {
        title: "Tailler des bûches",
        stamina: -2,
        successMessage: "Vous obtenez $1 bûches.",
        requiredItems: { create: { itemId: 2 } },
        requiredTools: { connect: { id: 2 } },
        loot: { create: { itemId: 3, minQuantity: 6, maxQuantity: 10 } },
      },
      {
        title: "Ramasser des galets",
        description: "Récupérer des galets et des coquillages à la main.",
        stamina: -1,
        successMessage: "Vous avez trouvé $1 galets et $2 coquillages.",
        terrains: { connect: { id: "beach" } },
        loot: {
          create: [
            { itemId: 20, minQuantity: 2, maxQuantity: 5 },
            { itemId: 30, minQuantity: 2, maxQuantity: 3 },
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
        title: "Fabriquer un marteau",
        stamina: -2,
        probability: 60,
        successMessage: "Vous avez fabriqué un marteau.",
        failureMessage:
          "En essayant de fabriquer un marteau, vous avez cassé vos matériaux !",
        structure: { connect: { id: 2 } },
        requiredItems: {
          create: [{ itemId: 1 }, { itemId: 20, quantity: 2 }],
        },
        toolLoot: { create: { toolId: 1 } },
      },
      {
        title: "Fabriquer une hache",
        stamina: -2,
        probability: 90,
        successMessage: "Vous avez fabriqué une hache.",
        failureMessage:
          "En essayant de fabriquer une hache, vous avez cassé vos matériaux !",
        structure: { connect: { id: 2 } },
        requiredItems: {
          create: [
            { itemId: 1, quantity: 2 },
            { itemId: 20, quantity: 2 },
          ],
        },
        requiredTools: { connect: { id: 1 } },
        toolLoot: { create: { toolId: 2 } },
      },
      {
        title: "Tailler une aiguille",
        stamina: 0,
        probability: 30,
        successMessage: "Vous avez taillé une aiguille dans la coquille.",
        failureMessage:
          "En essayant d'obtenir une aiguille, vous avez cassé la coquille !",
        requiredItems: { create: { itemId: 30, quantity: 1 } },
        requiredTools: { connect: { id: 1 } },
        toolLoot: { create: { toolId: 3 } },
      },
      {
        title: "Confectionner de la ficelle",
        stamina: 0,
        probability: 70,
        successMessage: "Vous avez confectionné de la ficelle.",
        failureMessage: "Vous avez cassé vos matériaux !",
        requiredItems: { create: { itemId: 10, quantity: 1 } },
        requiredTools: { connect: { id: 3 } },
        loot: { create: { itemId: 11 } },
      },
    ])
    // Prisma's .createMany does not support nested creates, so we use .create here
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
