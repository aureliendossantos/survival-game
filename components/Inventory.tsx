import useCharacterAndCell from "lib/queries/useCharacterAndCell"
import Card from "./Card"
import RenderMaterial from "./RenderMaterial"
import { RenderToolInstance } from "./RenderTool"

export default function InventoryCard() {
  return (
    <Card icon="bag" iconColor="mountains" title="Sac à dos">
      <Tools />
      <Materials />
    </Card>
  )
}

function Materials() {
  const { character } = useCharacterAndCell()
  if (!character) return null
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

function Tools() {
  const { character } = useCharacterAndCell()
  if (!character) return null
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
