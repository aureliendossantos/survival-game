import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { maps, dictionary } from "data/maps"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    console.log("Creating map...")
    const map = await prisma.map.create({
      data: {},
    })
    console.log("Created map " + map.id + ". Creating cells...")
    const cells = []
    const worldType = req.body.type || 0
    maps[worldType].map((row, y) =>
      row.map((terrain, x) =>
        cells.push({
          x: x,
          y: y,
          terrainId: dictionary[terrain],
          mapId: map.id,
        })
      )
    )
    await Promise.all(
      cells.map(async (cell) => {
        await prisma.cell.create({ data: cell })
      })
    )
    return res.json({
      success: true,
      message: `Monde ${map.id} créé`,
    })
  }
  if (req.method == "GET") {
    if (req.body.id) {
      const query = await prisma.map.findUnique({
        where: {
          id: req.body.id,
        },
        include: {
          cells: {
            include: { builtStructures: true },
          },
          characters: true,
        },
      })
      return res.json(query)
    }
    const query = await prisma.map.findMany()
    return res.json(query)
  }
  return res.status(405).json({ message: "Method not allowed" })
}
