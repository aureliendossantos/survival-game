import prisma from "/lib/prisma"

export default async (req, res) => {
  if (req.method != 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  const query = await prisma.cell.findFirst({
    where: {
      characters: {
        some: {
          id: { equals: req.query.id }
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
          contributors: true
        }
      }
    }
  })
  res.json(query)
}
