import prisma from '/lib/prisma'

export default async (req, res) => {
  if (req.method != 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  const query = await prisma.user.findMany()
  res.json(query)
}
