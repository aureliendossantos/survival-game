import { Item } from "@prisma/client"
import { CharacterWithInventoryAndMap } from "types/api"
import { BuildStarters, InventoryActions } from "./Actions"
import Card from "./Card"
import RenderItem from "./RenderItem"

type InventoryProps = {
  character: CharacterWithInventoryAndMap
}

export default function Inventory({ character }: InventoryProps) {
  return (
    <Card icon="bag" iconColor="mountains" title="Sac à dos">
      <InventoryItems character={character} />
    </Card>
  )
}

function InventoryItems({ character }: InventoryProps) {
  return (
    <div className="buttons-list">
      {character.inventory.length == 0 && "Vous ne portez rien dans votre sac."}
      {character.inventory.map((entry) => (
        <li key={entry.item.id} className="item">
          <RenderItem item={entry.item} quantity={entry.quantity} />{" "}
        </li>
      ))}
    </div>
  )
}
