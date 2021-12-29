import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async (req, res) => {
  if (req.method != 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  const query = await prisma.terrain.findUnique({
    where: {
      type: req.query.type
    },
    include: {
      actions: true
    }
  })
  res.json(query)
}
