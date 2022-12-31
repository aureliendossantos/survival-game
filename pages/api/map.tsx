import prisma from "lib/prisma"

export default async (req, res) => {
  if (req.method == "POST") {
    console.log("Creating map...")
    const map = await prisma.map.create({
      data: {},
    })
    console.log("Created map " + map.id + ". Creating cells...")
    const worlds = [
      [
        ["s", "b", "p"],
        ["b", "p", "f"],
        ["p", "f", "m"],
      ],
      [
        ["s", "b", "p", "p", "b", "s"],
        ["b", "p", "f", "f", "m", "b"],
        ["b", "f", "m", "m", "f", "p"],
        ["b", "f", "f", "m", "f", "b"],
        ["s", "b", "p", "f", "p", "s"],
        ["s", "s", "p", "p", "s", "s"],
      ],
    ]
    const dictionary = {
      s: "sea",
      b: "beach",
      p: "plains",
      f: "forest",
      m: "mountains",
    }
    const cells = []
    const worldType = req.body.type || 0
    worlds[worldType].map((row, y) =>
      row.map((terrain, x) =>
        cells.push({
          x: x,
          y: y,
          terrainId: dictionary[terrain],
          mapId: map.id,
        })
      )
    )
    await Promise.all(
      cells.map(async (cell) => {
        await prisma.cell.create({ data: cell })
      })
    )
    return res.json({
      success: true,
      message: `Monde ${map.id} créé`,
    })
  }
  if (req.method == "GET") {
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
  return res.status(405).json({ message: "Method not allowed" })
}
