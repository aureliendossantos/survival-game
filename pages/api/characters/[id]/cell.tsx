import { cellWithAllInfo } from "lib/api/types"
import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }
  const query = await prisma.cell.findFirst({
    where: {
      characters: {
        some: {
          id: { equals: String(req.body.id) },
        },
      },
    },
    include: cellWithAllInfo.include,
  })
  res.json(query)
}
