import { cellWithAllInfo } from "lib/api/types"
import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == "OPTIONS") return res.status(200).json({ message: "ok" })
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
