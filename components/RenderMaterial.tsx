import { Inventory, Material, Tool } from "@prisma/client"

type MaterialProps = {
  material: Material
  quantity?: number
  inventory?: Inventory[]
}

export default function RenderMaterial({
  material,
  quantity,
  inventory,
}: MaterialProps) {
  return (
    <span
      style={
        inventory
          ? meetRequirements(material, quantity, inventory)
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
      {material.title}
      {quantity > 1 && (material.pluralTitle || "s")}
    </span>
  )
}

function meetRequirements(
  material: Material | Tool,
  quantity: number,
  inventory?: Inventory[]
) {
  const entry = inventory.find((entry) => entry.materialId == material.id)
  if (!entry) return false
  return entry.quantity >= quantity
}
