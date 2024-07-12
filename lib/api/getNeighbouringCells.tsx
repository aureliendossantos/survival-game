import prisma from "lib/prisma"

export default async function getNeighbouringCells(
  mapId: number,
  x: number,
  y: number,
  dist = 1,
) {
  return await prisma.cell.findMany({
    where: {
      mapId: mapId,
      x: { in: [x - dist, x, x + dist] },
      y: { in: [y - dist, y, y + dist] },
    },
  })
}
