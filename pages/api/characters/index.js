import prisma from '/lib/prisma'

export default async (req, res) => {
  if (req.method == 'GET') {
    const query = await prisma.character.findMany()
    res.json(query)
  }
}
