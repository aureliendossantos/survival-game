import prisma from "/lib/prisma"

export default async (req, res) => {
  if (req.method == "GET") {
    const query = await prisma.inventory.findMany({
      where: { characterId: req.query.id },
      select: {
        material: {
          select: { id: true, name: true },
        },
        quantity: true,
      },
    })
    res.json(query)
  }
  if (req.method == "PATCH") {
    const query = await prisma.inventory.update({
      where: {
        characterId_materialId: {
          characterId: req.query.id,
          materialId: req.body.id,
        },
      },
      data: { quantity: { increment: req.body.quantity } },
    })
    res.json(query)
  }
}
