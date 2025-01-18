import { NextApiRequest, NextApiResponse } from "next"
import prisma from "lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == "OPTIONS") return res.status(200).json({ message: "ok" })
  if (req.method != "PATCH")
    return res.status(405).json({ message: "Bad method" })
  const character = await prisma.character.findUnique({
    where: { id: String(req.query.id) },
    include: { inventory: { include: { books: true } } },
  })
  const book = await prisma.book.findUnique({
    where: { id: req.body.id },
    include: { actions: true, structures: true },
  })
  if (!book || !character.inventory.books.find((b) => b.id == book.id))
    return res.status(404).json({ message: "Livre introuvable." })
  await prisma.character.update({
    where: { id: character.id },
    data: {
      knownActions: {
        connect: book.actions.map((a) => ({ id: a.id })),
      },
      knownStructures: {
        connect: book.structures.map((s) => ({ id: s.id })),
      },
      inventory: { update: { books: { disconnect: { id: book.id } } } },
    },
  })
  return res.json({
    success: true,
    message: "Vous avez appris de nouvelles techniques.",
  })
}
