import { NextApiRequest, NextApiResponse } from "next"
import prisma from "lib/prisma"
import getNeighbouringCells from "lib/api/getNeighbouringCells"

export default async function getCharacters(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == "OPTIONS") return res.status(200).json({ message: "ok" })
  if (req.method == "GET") {
    const query = await prisma.character.findMany()
    return res.json(query)
  }
  if (req.method == "POST") {
    const mapId = req.body.mapId
    // Find a random beach cell for the starting position
    const possibleCells = await prisma.cell.findMany({
      where: { mapId: mapId, terrainId: "beach" },
    })
    const startingCell =
      possibleCells[Math.floor(Math.random() * possibleCells.length)]
    const character = await prisma.character.create({
      data: {
        name: req.body.name,
        user: { connect: { id: req.body.userId } },
        map: { connect: { id: mapId } },
        cell: {
          connect: {
            id: startingCell.id,
          },
        },
        canSeeCells: {
          connect: (
            await getNeighbouringCells(mapId, startingCell.x, startingCell.y)
          ).map((cell) => ({ id: cell.id })),
        },
        inventory: { create: {} },
      },
    })
    return res.json({
      success: true,
      message: `Personnage ${character.name} créé.`,
      data: character,
    })
  }
  return res.status(405).json({ message: "Method not allowed" })
}
