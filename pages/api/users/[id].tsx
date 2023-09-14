import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }
  const query = await prisma.user.findUnique({
    where: {
      id: String(req.query.id),
    },
    include: {
      characters: true,
    },
  })
  res.json(query)
}
