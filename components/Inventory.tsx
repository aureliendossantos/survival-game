import useCharacterAndCell from "lib/queries/useCharacterAndCell"
import Card from "./Card"
import RenderMaterial from "./RenderMaterial"
import { RenderToolInstance } from "./RenderTool"
import { InventoryWithAllInfo } from "lib/api/types"

export default function PlayerInventoryCard() {
  const { character } = useCharacterAndCell()
  if (!character) return null
  return (
    <Card icon="bag" iconColor="item-icon" title="Sac à dos">
      {character.inventory.materials.length == 0 &&
        character.inventory.food.length == 0 &&
        character.inventory.tools.length == 0 &&
        "Vous ne portez rien dans votre sac."}
      <Tools inventory={character.inventory} />
      <Materials inventory={character.inventory} />
    </Card>
  )
}

export function Materials({ inventory }: { inventory: InventoryWithAllInfo }) {
  return (
    <div className="buttons-list">
      {inventory.materials
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

export function Tools({ inventory }: { inventory: InventoryWithAllInfo }) {
  return (
    <div className="buttons-list">
      {inventory.tools.map((entry) => (
        <li key={entry.id} className="material">
          <RenderToolInstance tool={entry} />{" "}
        </li>
      ))}
    </div>
  )
}
