import createDefaultData from "lib/api/createDefaultData"
import deleteAllData from "lib/api/deleteAllData"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * @swagger
 * /api/setup:
 *   delete:
 *     description: Deletes all data in the database
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
 *   post:
 *     description: "Fills the database with default values: definitions of structures, items, etc."
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
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == "OPTIONS") return res.status(200).json({ message: "ok" })
  if (req.method == "DELETE") {
    await deleteAllData()
    res.json({
      success: true,
      message: "Tables vidées.",
    })
  } else if (req.method == "POST") {
    await createDefaultData()
    res.json({
      success: true,
      message: "Tables remplies.",
    })
  } else {
    return res.status(405).json({ message: "Bad method" })
  }
}
