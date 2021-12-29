import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async (req, res) => {
  if (req.method == 'PATCH') {
    const query = await prisma.character.update({
      where: {
        id: parseInt(req.query.id)
      },
      data: {
        x: { increment: req.body.x },
        y: { increment: req.body.y }
      },
      select: {
        id: true,
        x: true,
        y: true
      }
    })
    res.json(query)
  }
}
