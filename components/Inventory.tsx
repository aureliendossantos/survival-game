import { CharacterWithAllInfo } from "lib/api/types"
import Card from "./Card"
import RenderMaterial from "./RenderMaterial"
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
      {character.inventory
        .filter((entry) => entry.quantity > 0)
        .map((entry) => (
          <li key={entry.material.id} className="material">
            <RenderMaterial
              material={entry.material}
              quantity={entry.quantity}
            />{" "}
          </li>
        ))}
    </div>
  )
}

function Tools({ character }: InventoryProps) {
  return (
    <div className="buttons-list">
      {character.tools.map((entry) => (
        <li key={entry.id} className="material">
          <RenderToolInstance tool={entry} />{" "}
        </li>
      ))}
    </div>
  )
}
