import { Character } from "@prisma/client"
import prisma from "lib/prisma"

/**
 * Gain or lose stamina for a character. The final value is capped between 0 and 10.
 * @param action A negative number to consume stamina, a positive number to restore stamina.
 * @param character The target character.
 */
export default async function consumeStamina(
  action: number,
  character: Character,
) {
  if (action != 0) {
    const newStamina = Math.min(Math.max(character.stamina + action, 0), 10)
    await prisma.character.update({
      where: { id: character.id },
      data: { stamina: newStamina },
    })
  }
}
