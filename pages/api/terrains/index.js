import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async (req, res) => {
  if (req.method == 'GET') {
    const query = await prisma.terrain.findMany()
    res.json(query)
  }
}
