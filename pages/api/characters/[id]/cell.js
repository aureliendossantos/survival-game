import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async (req, res) => {
  if (req.method != 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  const query = await prisma.cell.findFirst({
    where: {
      characters: {
        some: {
          id: { equals: parseInt(req.query.id) }
        }
      }
    },
    include: {
      terrain: {
        include: { actions: true }
      },
      builtStructures: {
        include: {
          structure: true,
          builtBy: true
        }
      }
    }
  })
  res.json(query)
}
