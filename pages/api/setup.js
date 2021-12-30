import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function getDate() {
  const now = new Date()
  return now.toLocaleDateString("fr-FR", {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

export default async (req, res) => {
  if (req.method == 'DELETE') {
    // Delete everything in the right order
    await prisma.actionLoot.deleteMany()
    await prisma.structureCost.deleteMany()
    await prisma.inventory.deleteMany()
    await prisma.builtStructure.deleteMany()
    await prisma.structure.deleteMany()
    await prisma.action.deleteMany()
    await prisma.item.deleteMany()
    await prisma.character.deleteMany()
    await prisma.cell.deleteMany()
    await prisma.terrain.deleteMany()
    await prisma.map.deleteMany()
    await prisma.user.deleteMany()
    res.json({ success: true, message: 'Tables vidées. (' + getDate() + ')' })
  } else if (req.method == 'POST') {
    // Create data
    const map = await prisma.map.create({
      data: {}
    })
    const terrains = [
      { id: 'plains', title: 'Plaines' },
      { id: 'beach', title: 'Plage', description: "Une bande de sable. Réchauffe les pieds." },
      { id: 'forest', title: 'Forêt', description: "Une forêt vierge à la végétation luxuriante." },
      { id: 'mountains', title: 'Montagnes', description: "Des pics escarpés." },
      { id: 'sea', title: 'Mer', description: "Si seulement c'était possible de la traverser..." }
    ]
    await Promise.all(
      terrains.map(async terrain => {
        await prisma.terrain.create({ data: terrain })
      })
    )
    const cells = [
      { x: 0, y: 0, terrainId: 'sea', mapId: map.id },
      { x: 1, y: 0, terrainId: 'beach', mapId: map.id },
      { x: 2, y: 0, terrainId: 'plains', mapId: map.id },
      { x: 0, y: 1, terrainId: 'beach', mapId: map.id },
      { x: 1, y: 1, terrainId: 'plains', mapId: map.id },
      { x: 2, y: 1, terrainId: 'forest', mapId: map.id },
      { x: 0, y: 2, terrainId: 'plains', mapId: map.id },
      { x: 1, y: 2, terrainId: 'forest', mapId: map.id },
      { x: 2, y: 2, terrainId: 'mountains', mapId: map.id }
    ]
    await Promise.all(
      cells.map(async cell => {
        await prisma.cell.create({ data: cell })
      })
    )
    const user = await prisma.user.create({
      data: { name: "Aurélien" }
    })
    const character = await prisma.character.create({
      data: { name: "John", x: 1, y: 1, userId: user.id, mapId: map.id }
    })
    const items = [
      { id: 1, title: "Branchages" },
      { id: 2, title: "Feuillages" },
      { id: 3, title: "Galets" },
      { id: 4, title: "Coquillages" },
    ]
    await Promise.all(
      items.map(async item => {
        await prisma.item.create({ data: item })
      })
    )
    const structures = [
      {
        title: "Campement",
        description: "Un premier campement.",
        minDurability: 60,
        maxDurability: 120,
        requiredItems: {
          create: [
            { itemId: 1, quantity: 20 },
            { itemId: 2, quantity: 10 }
          ]
        }
      }
    ]
    await Promise.all(
      structures.map(async structure => {
        await prisma.structure.create({ data: structure })
      })
    )
    const actions = [
      {
        title: "Ramasser du bois",
        description: "Récupérer des branchages et de la verdure à la main.",
        successMessage: "Vous avez trouvé $1 branchages et $2 feuillages.",
        terrains: { connect: { id: 'forest' } },
        loot: {
          create: [
            { itemId: 1, minQuantity: 6, maxQuantity: 10 },
            { itemId: 2, minQuantity: 3, maxQuantity: 5 }
          ]
        }
      }
    ]
    await Promise.all(
      actions.map(async action => {
        await prisma.action.create({ data: action })
      })
    )
    res.json({ success: true, message: 'Tables remplies. (' + getDate() + ')' })
  } else {
    return res.status(405).json({ message: 'Bad method' })
  }
}
