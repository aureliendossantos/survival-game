import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { maps, dictionary } from "data/maps"

/**
 * @swagger
 * /api/map:
 *   post:
 *     description: "Creates a new map"
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: integer
 *                 description: "The type of map to create. See `data/maps.ts` for the list of available maps. Default: `0`"
 *     responses:
 *       200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                message:
 *                  type: string
 *   get:
 *     description: "Gets the list of all maps IDs."
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
        }),
      ),
    )
    await Promise.all(
      cells.map(async (cell) => {
        await prisma.cell.create({ data: cell })
      }),
    )
    return res.json({
      success: true,
      message: `Monde ${map.id} créé`,
    })
  }
  if (req.method == "GET") {
    const query = await prisma.map.findMany()
    return res.json(query)
  }
  return res.status(405).json({ message: "Method not allowed" })
}
