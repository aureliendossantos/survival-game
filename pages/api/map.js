import prisma from "/lib/prisma"

export default async (req, res) => {
  if (req.method == "POST") {
    const map = await prisma.map.create({
      data: {},
    })
    const cells = [
      { x: 0, y: 0, terrainId: "sea", mapId: map.id },
      { x: 1, y: 0, terrainId: "beach", mapId: map.id },
      { x: 2, y: 0, terrainId: "plains", mapId: map.id },
      { x: 0, y: 1, terrainId: "beach", mapId: map.id },
      { x: 1, y: 1, terrainId: "plains", mapId: map.id },
      { x: 2, y: 1, terrainId: "forest", mapId: map.id },
      { x: 0, y: 2, terrainId: "plains", mapId: map.id },
      { x: 1, y: 2, terrainId: "forest", mapId: map.id },
      { x: 2, y: 2, terrainId: "mountains", mapId: map.id },
    ]
    await Promise.all(
      cells.map(async (cell) => {
        await prisma.cell.create({ data: cell })
      })
    )
    return res.json({
      success: true,
      message: "Carte et cellules créées.",
    })
  }
  if (req.method != "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }
  if (req.body.id) {
    const query = await prisma.map.findUnique({
      where: {
        id: req.body.id,
      },
      include: {
        cells: {
          include: { builtStructures: true },
        },
        characters: true,
      },
    })
    return res.json(query)
  }
  const query = await prisma.map.findMany()
  return res.json(query)
}
