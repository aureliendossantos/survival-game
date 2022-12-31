import { CharacterWithAllInfo } from "lib/api/types"
import Card from "./Card"
import RenderItem from "./RenderItem"
import { RenderToolInstance } from "./RenderTool"

type InventoryProps = {
  character: CharacterWithAllInfo
}

export default function Inventory({ character }: InventoryProps) {
  return (
    <Card icon="bag" iconColor="mountains" title="Sac à dos">
      <Tools character={character} />
      <Materials character={character} />
    </Card>
  )
}

function Materials({ character }: InventoryProps) {
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

function Tools({ character }: InventoryProps) {
  return (
    <div className="buttons-list">
      {character.tools.map((entry) => (
        <li key={entry.id} className="item">
          <RenderToolInstance tool={entry} />{" "}
        </li>
      ))}
    </div>
  )
}
