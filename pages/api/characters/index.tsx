import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function getCharacters(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    const query = await prisma.character.findMany()
    return res.json(query)
  }
  if (req.method == "POST") {
    const character = await prisma.character.create({
      data: {
        name: req.body.name,
        userId: req.body.userId,
        mapId: req.body.mapId,
        x: 1,
        y: 1,
      },
    })
    return res.json({
      success: true,
      message: `Personnage ${character.name} créé.`,
    })
  }
  return res.status(405).json({ message: "Method not allowed" })
}
