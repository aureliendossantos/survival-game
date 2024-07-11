import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { maps, dictionary } from "data/maps"

/**
 * @swagger
 * /api/map/{id}:
 *   get:
 *     description: "Gets the contents of a specific map."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "The ID of the map to get."
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == "OPTIONS") return res.status(200).json({ message: "ok" })
  if (req.method == "GET") {
    const query = await prisma.map.findUnique({
      where: {
        id: parseInt(String(req.query.id)),
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
  return res.status(405).json({ message: "Method not allowed" })
}
