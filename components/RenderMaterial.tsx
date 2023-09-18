import { Material } from "@prisma/client"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"

function getIconSprite(material: Material) {
  switch (material.id) {
    case "branch":
      return "bg-[-300%_-400%]"
    case "stone":
      return "bg-[-400%_-400%]"
    case "greenery":
      return "bg-[-300%_-500%]"
    case "shell":
      return "bg-[-500%_-400%]"
    case "string":
      return "bg-[-0%_-400%]"
    case "net":
      return "bg-[-600%_-400%]"
    default:
      return "bg-[-0%_-0%]"
  }
}

type MaterialProps = {
  material: Material
  quantity?: number
}

export default function RenderMaterial({ material, quantity }: MaterialProps) {
  return (
    <span>
      {/**
      {material.title}
      {quantity > 1 && (material.pluralTitle || "s")}
      */}
      <div className="relative -mb-[0.3em] -mt-[0.1em] inline-block h-[1.4em] w-[1.4em]">
        <div
          className={`spritesheet ${getIconSprite(material)}`}
          style={{ filter: "invert(100%)" }}
        />
      </div>
      {quantity && <span className="font-medium">{quantity}</span>}
    </span>
  )
}

export function MaterialRequirement({ material, quantity }: MaterialProps) {
  const { character } = useCharacterAndCell()
  const entry =
    character &&
    character.inventory.materials.find(
      (entry) => entry.materialId == material.id,
    )
  const requirementMet = entry && entry.quantity >= quantity
  return (
    <span className={!requirementMet ? "requirements-not-met" : undefined}>
      {/**
      {material.title}
      {quantity > 1 && (material.pluralTitle || "s")}
      */}
      <div
        className={`relative -mb-[0.3em] -mt-[0.1em] inline-block h-[1.4em] w-[1.4em] ${
          !requirementMet ? "opacity-50" : ""
        }`}
      >
        <div
          className={`spritesheet ${getIconSprite(material)}`}
          style={{ filter: "invert(100%)" }}
        />
      </div>
      {quantity && <span className="font-semibold">{quantity}</span>}
    </span>
  )
}
