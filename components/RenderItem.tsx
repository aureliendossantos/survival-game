import { Inventory, Item, Tool, ToolInstance } from "@prisma/client"
import { ToolInstanceWithAllInfo } from "types/api"

type ItemProps = {
  item: Item
  quantity?: number
  inventory?: Inventory[]
}

export default function RenderItem({ item, quantity, inventory }: ItemProps) {
  return (
    <span
      style={
        inventory
          ? meetRequirements(item, quantity, inventory)
            ? null
            : { color: "grey" }
          : null
      }
    >
      {quantity && (
        <>
          <strong>{quantity}</strong>{" "}
        </>
      )}
      {item.title}
      {quantity > 1 && (item.pluralTitle || "s")}
    </span>
  )
}

function meetRequirements(
  item: Item | Tool,
  quantity: number,
  inventory?: Inventory[]
) {
  const entry = inventory.find((entry) => entry.itemId == item.id)
  if (!entry) return false
  return entry.quantity >= quantity
}

type ToolProps = {
  tool: Tool
  toolInventory?: ToolInstanceWithAllInfo[]
}

export function RenderToolRequirement({ tool, toolInventory }: ToolProps) {
  return (
    <span
      style={
        toolInventory
          ? toolInventory.find((entry) => entry.toolId == tool.id)
            ? null
            : { color: "grey" }
          : null
      }
    >
      {tool.title}
    </span>
  )
}

type ToolInstanceProps = {
  tool: ToolInstanceWithAllInfo
}

export function RenderToolInstance({ tool }: ToolInstanceProps) {
  return (
    <span>
      <strong>{tool.tool.title}</strong>{" "}
      {Math.round((tool.durability / tool.tool.durability) * 100)}%
    </span>
  )
}
