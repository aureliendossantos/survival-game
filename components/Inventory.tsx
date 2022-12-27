import { Item } from "@prisma/client"
import { CharacterWithInventoryAndMap } from "types/api"
import { InventoryActions } from "./Actions"
import Card from "./Card"
import RenderItem from "./RenderItem"

type InventoryProps = {
  character: CharacterWithInventoryAndMap
}

export default function Inventory({ character }: InventoryProps) {
  return (
    <Card icon="bag" iconColor="mountains" title="Besace">
      <InventoryItems character={character} />
      <div className="buttons-list">
        <InventoryActions character={character} />
      </div>
    </Card>
  )
}

function InventoryItems({ character }: InventoryProps) {
  return (
    <div className="buttons-list">
      {character.inventory.map((entry) => (
        <li key={entry.item.id} className="item">
          <RenderItem item={entry.item} quantity={entry.quantity} />{" "}
        </li>
      ))}
    </div>
  )
}
