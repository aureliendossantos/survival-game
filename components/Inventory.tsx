import { Item } from "@prisma/client"
import { CharacterWithInventoryAndMap } from "types/api"

type InventoryProps = {
  character: CharacterWithInventoryAndMap
}

export default function Inventory({ character }: InventoryProps) {
  return (
    <ul>
      {character.inventory.map((entry) => (
        <li key={entry.item.id} className="item">
          <strong>{entry.quantity}</strong> {entry.item.title}
        </li>
      ))}
    </ul>
  )
}
