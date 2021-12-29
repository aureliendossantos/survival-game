import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async (req, res) => {
  if (req.method != 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  const query = await prisma.character.findUnique({
    where: {
      id: parseInt(req.query.id)
    },
    select: {
      id: true,
      name: true,
      x: true,
      y: true,
      inventory: {
        select: {
          item: {
            select: {
              id: true,
              name: true
            }
          },
          quantity: true
        }
      },
      map: {
        select: {
          cells: {
            select: {
              x: true,
              y: true,
              type: true,
              builtStructures: true
            }
          }
        }
      }
    }
  })
  res.json(query)
}
