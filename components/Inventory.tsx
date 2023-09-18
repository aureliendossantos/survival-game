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
      <div className="flex flex-col gap-[3px] text-base">
        <Tools inventory={character.inventory} />
        <Materials inventory={character.inventory} />
      </div>
    </Card>
  )
}

export function Materials({ inventory }: { inventory: InventoryWithAllInfo }) {
  return (
    <ul className="flex gap-[3px]">
      {inventory.materials
        .filter((entry) => entry.quantity > 0)
        .map((entry) => (
          <li
            key={entry.material.id}
            className="rounded bg-[#1c1817] p-[0.6em]"
          >
            <RenderMaterial
              material={entry.material}
              quantity={entry.quantity}
            />{" "}
          </li>
        ))}
    </ul>
  )
}

export function Tools({ inventory }: { inventory: InventoryWithAllInfo }) {
  return (
    <ul className="flex gap-[3px]">
      {inventory.tools.map((entry) => (
        <li key={entry.id} className="rounded bg-[#1c1817] p-[0.6em]">
          <RenderToolInstance tool={entry} />{" "}
        </li>
      ))}
    </ul>
  )
}
