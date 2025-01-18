import { Prisma } from "@prisma/client"

export const materials = Prisma.validator<Prisma.MaterialCreateManyInput[]>()([
  { order: 1, id: "branch", title: "Branche" },
  { order: 2, id: "trunk", title: "Tronc" },
  { order: 3, id: "log", title: "Bûche" },
  { order: 4, id: "greenery", title: "Feuillage" },
  { order: 5, id: "string", title: "Ficelle" },
  { order: 6, id: "net", title: "Filet" },
  { order: 7, id: "stone", title: "Galet" },
  { order: 8, id: "shell", title: "Coquillage" },
])

export const food = Prisma.validator<Prisma.FoodCreateManyInput[]>()([
  { order: 1, id: "freshwaterSnail", title: "Escargot d'eau douce" },
  {
    order: 2,
    id: "grilledFreshwaterSnail",
    title: "Escargot d'eau douce grillé",
  },
  { order: 3, id: "fish", title: "Poisson" },
  { order: 4, id: "grilledFish", title: "Poisson grillé" },
])

export const tools = Prisma.validator<Prisma.ToolCreateManyInput[]>()([
  {
    order: 1,
    id: "hammer",
    title: "Marteau",
    pluralTitle: "Marteaux",
    durability: 6,
  },
  { order: 2, id: "axe", title: "Hache", durability: 13 },
  { order: 3, id: "needle", title: "Aiguille", durability: 17 },
  { order: 4, id: "fishingNet", title: "Épuisette", durability: 14 },
])

export const books = Prisma.validator<Prisma.BookCreateManyInput[]>()([
  { order: 1, id: "survivalManual", title: "Manuel de survie" },
  { order: 2, id: "fishingGuide", title: "Guide de pêche" },
])
