import prisma from "lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const user = await prisma.user.create({
      data: { name: req.body.name },
    })
    return res.json({
      success: true,
      message: `Compte ${user.name} créé.`,
    })
  } else if (req.method == "GET") {
    const users = await prisma.user.findMany()
    return res.json(users)
  }
  return res.status(405).json({ message: "Method not allowed" })
}
