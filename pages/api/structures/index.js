import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async (req, res) => {
  if (req.method == 'GET') {
    const query = await prisma.structure.findMany({
      include: {
        requiredItems: {
          include: {
            item: true
          }
        }
      }
    })
    res.json(query)
  }
}
