import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

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
    const character = await prisma.character.create({
      data: {
        name: req.body.name,
        user: { connect: { id: req.body.userId } },
        map: { connect: { id: req.body.mapId } },
        cell: { connect: { mapId_x_y: { mapId: req.body.mapId, x: 1, y: 1 } } },
        inventory: { create: {} },
      },
    })
    return res.json({
      success: true,
      message: `Personnage ${character.name} créé.`,
    })
  }
  return res.status(405).json({ message: "Method not allowed" })
}
