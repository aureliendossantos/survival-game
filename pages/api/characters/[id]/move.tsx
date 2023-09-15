import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "lib/prisma"

/**
 * @swagger
 * /api/characters/{id}/move:
 *   patch:
 *     description: "Moves the character in the given direction. If the destination cell consumes stamina, the character will lose stamina. If the character has no stamina left, the move will fail."
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               mapId:
 *                 type: integer
 *               characterId:
 *                 type: string
 *               dirX:
 *                 type: integer
 *               dirY:
 *                 type: integer
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
const move = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "PATCH") {
    const mapId = parseInt(req.body.mapId)
    const characterId = req.body.characterId
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      select: { x: true, y: true, stamina: true },
    })
    const destX = parseInt(req.body.dirX) + character.x
    const destY = parseInt(req.body.dirY) + character.y
    const cell = await prisma.cell.findUnique({
      where: {
        mapId_x_y: { mapId: mapId, x: destX, y: destY },
      },
      select: {
        terrain: { select: { stamina: true } },
      },
    })
    if (cell.terrain.stamina < 0) {
      if (character.stamina < -cell.terrain.stamina) {
        return res.json({
          success: false,
          message:
            "Vous êtes trop fatigué pour vous déplacer sur ce type de terrain.",
        })
      }
      const newStamina = Math.min(
        Math.max(character.stamina + cell.terrain.stamina, 0),
        10,
      )
      await prisma.character.update({
        where: { id: characterId },
        data: { x: destX, y: destY, stamina: newStamina },
      })
      return res.json({
        success: true,
        message: `Vous vous êtes déplacé en utilisant ${cell.terrain.stamina} énergie.`,
      })
    }
    await prisma.character.update({
      where: { id: characterId },
      data: { x: destX, y: destY },
    })
    return res.json({
      success: true,
      message: `Vous vous êtes déplacé sans utiliser d'énergie.`,
    })
  }
}

export default move
