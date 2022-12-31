import { Inventory, Item, Tool } from "@prisma/client"

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
