import { Character } from "@prisma/client"
import prisma from "lib/prisma"

export default async function consumeStamina(
  action: number,
  character: Character
) {
  if (action != 0) {
    const newStamina = Math.min(Math.max(character.stamina + action, 0), 10)
    await prisma.character.update({
      where: { id: character.id },
      data: { stamina: newStamina },
    })
  }
}
