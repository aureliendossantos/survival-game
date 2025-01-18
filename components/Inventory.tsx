import useCharacterAndCell from "lib/queries/useCharacterAndCell"
import Card from "./Card"
import RenderMaterial from "./RenderMaterial"
import { RenderToolInstance } from "./RenderTool"
import { BuiltStructureWithAllInfo, InventoryWithAllInfo } from "lib/api/types"
import RenderFoodInstance from "./RenderFood"
import { FormEvent, useState } from "react"
import Modal from "./Modal"
import { useSWRConfig } from "swr"
import query from "lib/query"
import toast from "react-hot-toast"
import RenderBook from "./RenderBook"

export default function PlayerInventoryCard() {
  const { character } = useCharacterAndCell()
  if (!character) return null
  return (
    <Card icon="bag" iconColor="item-icon" title="Sac à dos">
      {character.inventory.materials.length == 0 &&
        character.inventory.food.length == 0 &&
        character.inventory.tools.length == 0 &&
        character.inventory.books.length == 0 &&
        "Vous ne portez rien dans votre sac."}
      <div className="flex flex-col gap-[3px] text-base">
        <Books inventory={character.inventory} />
        <Food inventory={character.inventory} />
        <Tools inventory={character.inventory} />
        <Materials inventory={character.inventory} />
      </div>
    </Card>
  )
}

export type TradeQuery = {
  targetInventoryId: string
  playerInventory: TradeInventory
  targetInventory: TradeInventory
}
export type TradeInventory = {
  materials: TradeMaterial[]
  tools: TradeInstance[]
  food: TradeInstance[]
}
export type TradeMaterial = { id: string; amount: number }
export type TradeInstance = string

export function StructureInventory({
  structure,
}: {
  structure: BuiltStructureWithAllInfo
}) {
  const { character } = useCharacterAndCell()
  const { mutate } = useSWRConfig()
  const [open, setOpen] = useState(null)
  const [close, setClose] = useState(null)
  if (!structure.structure.hasInventory) return null
  const inventory = structure.inventory

  async function trade(
    event: FormEvent<HTMLFormElement>,
    targetInventoryId: string,
  ) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    // filter entries with the key "targetInventoryId-itemId" and turning it into "itemId"
    const getItemsArray = (
      type: "material" | "tool" | "food",
      inventoryId: string,
    ) =>
      Array.from(formData.entries()).filter(
        ([key, value]) =>
          key.split("-")[0] == type &&
          key.split("-")[1] == inventoryId &&
          value > "0",
      )
    const getInventory = (id: string) => ({
      materials: getItemsArray("material", id).map(([key, value]) => ({
        id: key.split("-")[2],
        amount: Number(value),
      })),
      tools: getItemsArray("tool", id).map(([key]) => key.split("-")[2]),
      food: getItemsArray("food", id).map(([key]) => key.split("-")[2]),
    })
    const targetInventory = getInventory(targetInventoryId)
    const playerInventory = getInventory(character.inventoryId)
    const body: TradeQuery = {
      targetInventoryId,
      targetInventory,
      playerInventory,
    }
    const response = await query(
      `/api/characters/${character.id}/trade`,
      "PATCH",
      body,
    )
    response.success
      ? toast.success(response.message)
      : toast.error(response.message)
  }

  return (
    <div className="mb-[3px] flex flex-col gap-[3px] text-base">
      <Food inventory={inventory} />
      <Tools inventory={inventory} />
      <Materials inventory={inventory} />
      <button
        onClick={open}
        className="bg-bg-950 rounded p-[0.6em] transition-colors hover:bg-[#4d423f]"
      >
        Échanger
      </button>
      <Modal setOpen={setOpen} setClose={setClose}>
        <form
          autoComplete="off"
          onSubmit={async (event) => {
            await trade(event, structure.inventoryId)
            mutate("/api/characters/" + character.id)
          }}
          className="grid grid-cols-2 gap-[9px]"
        >
          <TradeFieldset
            inventory={inventory}
            title={structure.structure.title}
          />
          <TradeFieldset inventory={character.inventory} title="Sac à dos" />
          <button
            type="submit"
            className="bg-bg-950 col-span-2 rounded p-[0.6em]"
          >
            Échanger
          </button>
        </form>
      </Modal>
    </div>
  )
}

export function TradeFieldset({
  inventory,
  title,
}: {
  inventory: InventoryWithAllInfo
  title: string
}) {
  return (
    <fieldset>
      <h2 className="mb-2 text-center">{title}</h2>
      <div className="flex flex-col gap-[3px]">
        {inventory.materials
          .filter((entry) => entry.quantity > 0)
          .map((entry) => (
            <label
              key={entry.material.id}
              className="flex justify-end gap-[3px]"
            >
              <div className="bg-bg-950 rounded p-[0.6em]">
                <RenderMaterial
                  material={entry.material}
                  quantity={entry.quantity}
                />
              </div>
              <TradeNumberInput
                name={`material-${entry.inventoryId}-${entry.materialId}`}
                max={entry.quantity}
              />
            </label>
          ))}
        {inventory.tools.map((entry) => (
          <label key={entry.id} className="flex justify-end gap-[3px]">
            <RenderToolInstance tool={entry} />
            <TradeNumberInput
              name={`tool-${entry.inventoryId}-${entry.id}`}
              max={1}
            />
          </label>
        ))}
        {inventory.food.map((entry) => (
          <label key={entry.id} className="flex justify-end gap-[3px]">
            <RenderFoodInstance instance={entry} />
            <TradeNumberInput
              name={`food-${entry.inventoryId}-${entry.id}`}
              max={1}
            />
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function TradeNumberInput({ name, max }: { name: string; max: number }) {
  return (
    <input
      type="number"
      min="0"
      max={max}
      defaultValue="0"
      className="bg-bg-950 min-w-[3.1em] rounded pl-[0.6em] leading-loose"
      name={name}
    />
  )
}

export function Materials({ inventory }: { inventory: InventoryWithAllInfo }) {
  if (inventory.materials.filter((i) => i.quantity > 0).length == 0) return null
  return (
    <ul className="flex flex-wrap gap-[3px]">
      {inventory.materials
        .filter((entry) => entry.quantity > 0)
        .map((entry) => (
          <li key={entry.material.id} className="bg-bg-950 rounded p-[0.6em]">
            <RenderMaterial
              material={entry.material}
              quantity={entry.quantity}
            />
          </li>
        ))}
    </ul>
  )
}

export function Books({ inventory }: { inventory: InventoryWithAllInfo }) {
  if (inventory.books.length == 0) return null
  return (
    <ul className="flex flex-wrap gap-[3px]">
      {inventory.books.map((entry) => (
        <li key={entry.id}>
          <RenderBook book={entry} />
        </li>
      ))}
    </ul>
  )
}

export function Food({ inventory }: { inventory: InventoryWithAllInfo }) {
  if (inventory.food.length == 0) return null
  return (
    <ul className="flex flex-wrap gap-[3px]">
      {inventory.food.map((entry) => (
        <li key={entry.id}>
          <RenderFoodInstance instance={entry} />
        </li>
      ))}
    </ul>
  )
}

export function Tools({ inventory }: { inventory: InventoryWithAllInfo }) {
  if (inventory.tools.length == 0) return null
  return (
    <ul className="flex flex-wrap gap-[3px]">
      {inventory.tools.map((entry) => (
        <li key={entry.id} className="bg-bg-950 rounded p-[0.6em]">
          <RenderToolInstance tool={entry} />{" "}
        </li>
      ))}
    </ul>
  )
}
