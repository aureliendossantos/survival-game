import { Material } from "@prisma/client"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"

type MaterialProps = {
  material: Material
  quantity?: number
}

export default function RenderMaterial({ material, quantity }: MaterialProps) {
  return (
    <span>
      {quantity && (
        <>
          <span className="quantity">{quantity}</span>{" "}
        </>
      )}
      {material.title}
      {quantity > 1 && (material.pluralTitle || "s")}
    </span>
  )
}

export function MaterialRequirement({ material, quantity }: MaterialProps) {
  const { character } = useCharacterAndCell()
  const entry =
    character &&
    character.inventory.materials.find(
      (entry) => entry.materialId == material.id
    )
  const requirementMet = entry && entry.quantity >= quantity
  return (
    <span className={!requirementMet ? "requirements-not-met" : undefined}>
      {quantity && (
        <>
          <span className="quantity">{quantity}</span>{" "}
        </>
      )}
      {material.title}
      {quantity > 1 && (material.pluralTitle || "s")}
    </span>
  )
}
