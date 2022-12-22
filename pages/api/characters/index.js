import prisma from "/lib/prisma"

export default async (req, res) => {
  if (req.method == "POST") {
    const character = await prisma.character.create({
      data: {
        name: req.body.name,
        userId: req.body.userId,
        mapId: req.body.mapId,
        x: 1,
        y: 1,
      },
    })
    return res.json({
      success: true,
      message: "Personnage créé avec l'ID " + character.id,
    })
  } else if (req.method == "GET") {
    const query = await prisma.character.findMany()
    return res.json(query)
  }
  return res.status(405).json({ message: "Method not allowed" })
}
