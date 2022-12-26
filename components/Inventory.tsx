import { Item } from "@prisma/client"
import { CharacterWithInventoryAndMap } from "types/api"
import RenderItem from "./RenderItem"

type InventoryProps = {
  character: CharacterWithInventoryAndMap
}

export default function Inventory({ character }: InventoryProps) {
  return (
    <ul>
      {character.inventory.map((entry) => (
        <li key={entry.item.id} className="item">
          <RenderItem item={entry.item} quantity={entry.quantity} />{" "}
        </li>
      ))}
    </ul>
  )
}
