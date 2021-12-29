import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async (req, res) => {
  if (req.method == 'GET') {
    const query = await prisma.character.findMany()
    res.json(query)
  }
}
