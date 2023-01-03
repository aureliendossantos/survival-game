import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != "GET")
    return res.status(405).json({ message: "Bad method" })
  const structureId = String(req.query.id)
  const structure = await prisma.structure.findUnique({
    where: {
      id: structureId,
    },
    include: {
      requiredMaterials: {
        include: { material: true },
      },
      modules: { select: { id: true } },
    },
  })
  return res.json(structure)
}
