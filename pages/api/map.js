import prisma from '/lib/prisma'

export default async (req, res) => {
  if (req.method != 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  const query = await prisma.map.findUnique({
    where: {
      id: 1
    },
    include: {
      cells: {
        include: { builtStructures: true }
      },
      characters: true
    }
  })
  res.json(query)
}
