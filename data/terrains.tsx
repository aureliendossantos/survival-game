import { Prisma } from "@prisma/client"

export const terrains = Prisma.validator<Prisma.TerrainCreateInput[]>()([
  { id: "plains", title: "Plaines" },
  {
    id: "beach",
    title: "Plage",
    description: "Une bande de sable qui réchauffe les pieds.",
  },
  {
    id: "forest",
    title: "Forêt",
    description: "Une forêt vierge à la végétation luxuriante.",
    stamina: -1,
  },
  {
    id: "mountains",
    title: "Montagnes",
    description: "Des pics escarpés.",
    stamina: -2,
  },
  {
    id: "sea",
    title: "Mer",
    description: "Si seulement c'était possible de la traverser...",
  },
])
