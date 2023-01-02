import { BuiltStructure } from "@prisma/client"
import query from "lib/query"
import toast from "react-hot-toast"
import { useSWRConfig } from "swr"
import {
  ActionWithRequirements,
  BuiltStructureWithAllInfo,
  CharacterWithAllInfo,
  StructureWithAllInfo,
} from "lib/api/types"
import RenderMaterial from "./RenderMaterial"
import { RenderToolRequirement } from "./RenderTool"
import { StructureCard, TerrainCard } from "./LocationInfo"
import ProgressButton from "./ProgressButton/ProgressButton"
import useStructures from "lib/queries/useStructures"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"

async function doAction(characterId: string, actionId: number) {
  const body = {
    id: actionId,
  }
  return await query(
    "/api/characters/" + characterId + "/action",
    "PATCH",
    body
  )
}

async function repair(characterId: string, builtStructureId: string) {
  const body = {
    id: builtStructureId,
  }
  return await query(
    "/api/characters/" + characterId + "/repair",
    "PATCH",
    body
  )
}

async function build(
  characterId: string,
  structureId: string,
  parentBuiltStructureId?: string
) {
  const body = {
    id: structureId,
    parentId: parentBuiltStructureId,
  }
  return await query("/api/characters/" + characterId + "/build", "PATCH", body)
}

export default function StructureCards() {
  const { cell } = useCharacterAndCell()
  if (!cell) return null
  return (
    <>
      {cell.builtStructures
        .filter((structure) => structure.moduleOfId == null)
        .map((structure) => (
          <StructureCard
            key={structure.id}
            structure={structure}
            builtStructures={cell.builtStructures}
          />
        ))}
    </>
  )
}

export function BuildStarters() {
  const { structures } = useStructures()
  if (!structures) return null
  return (
    <>
      {structures
        .filter((structure) => structure.moduleOfId == null)
        .map((structure) => (
          <BuildButton key={structure.id} structure={structure} />
        ))}
    </>
  )
}

type BuildModulesProps = {
  character: CharacterWithAllInfo
  builtStructure: BuiltStructureWithAllInfo
}

export function BuildModules({ character, builtStructure }: BuildModulesProps) {
  const { structures } = useStructures()
  if (!structures || builtStructure.durability == 0) return null
  return (
    <>
      {structures
        .find((structure) => structure.id == builtStructure.structureId)
        .modules.map((builtStructureModule) => {
          const structureModule = structures.find(
            (structure) => structure.id == builtStructureModule.id
          )
          return (
            <BuildButton
              key={structureModule.id}
              structure={structureModule}
              parent={builtStructure}
            />
          )
        })}
    </>
  )
}

type BuildButtonProps = {
  structure: StructureWithAllInfo
  parent?: BuiltStructure
}

function BuildButton({ structure, parent }: BuildButtonProps) {
  const { mutate } = useSWRConfig()
  const { character } = useCharacterAndCell()
  if (!character) return null
  return (
    <li>
      <ProgressButton
        label={<p>Construire un {structure.title}</p>}
        stamina={structure.requiredStamina}
        task={async () => {
          const response = await build(
            character.id,
            structure.id,
            parent && parent.id
          )
          response.success
            ? toast.success(response.message)
            : toast.error(response.message)
          mutate("/api/characters/" + character.id)
        }}
      />
      <div className="material">
        {structure.requiredMaterials.map((requirement) => (
          <span key={requirement.materialId}>
            <RenderMaterial
              material={requirement.material}
              quantity={requirement.quantity}
              inventory={character.inventory}
            />{" "}
          </span>
        ))}
      </div>
    </li>
  )
}

export function CellActions() {
  const { cell } = useCharacterAndCell()
  if (!cell) return null
  return (
    <>
      {cell.terrain.actions.map((action) => (
        <ActionButton key={action.id} action={action} />
      ))}
    </>
  )
}

export function InventoryActions() {
  const { character } = useCharacterAndCell()
  if (!character) return null
  return (
    <>
      <BuildStarters />
      {character.inventory.map((entry) =>
        entry.material.inActionCost
          .filter((entry) => entry.action.structureId == null)
          .map((entry) => (
            <ActionButton key={entry.action.id} action={entry.action} />
          ))
      )}
    </>
  )
}

type StructureActionsProps = {
  character: CharacterWithAllInfo
  builtStructure: BuiltStructureWithAllInfo
}

export function StructureActions({
  character,
  builtStructure,
}: StructureActionsProps) {
  if (builtStructure.durability == 0)
    return (
      <p>
        Vous ne pouvez pas utiliser cette structure car elle est trop
        endommagée.
      </p>
    )
  return (
    <>
      {builtStructure.structure.actions.map((action) => (
        <ActionButton key={action.id} action={action} />
      ))}
    </>
  )
}

type ActionButtonProps = {
  action: ActionWithRequirements
}

export function ActionButton({ action }: ActionButtonProps) {
  const { mutate } = useSWRConfig()
  const { character } = useCharacterAndCell()
  if (!character) return null
  return (
    <li>
      <ProgressButton
        label={action.title}
        stamina={action.stamina}
        task={async () => {
          const response = await doAction(character.id, action.id)
          response.success
            ? toast.success(response.message)
            : toast.error(response.message)
          mutate("/api/characters/" + character.id)
        }}
      />
      {action.requiredMaterials.length > 0 && (
        <div className="material">
          {action.requiredMaterials.map((requirement) => (
            <span key={requirement.materialId}>
              <RenderMaterial
                material={requirement.material}
                quantity={requirement.quantity}
                inventory={character.inventory}
              />{" "}
            </span>
          ))}
        </div>
      )}
      {action.requiredTools.length > 0 && (
        <div className="material">
          {"Outil requis : "}
          {action.requiredTools.map((tool) => (
            <span key={tool.id}>
              <RenderToolRequirement
                tool={tool}
                toolInventory={character.tools}
              />{" "}
            </span>
          ))}
        </div>
      )}
      {action.probability < 100 && (
        <div className="material">{action.probability}% réussite</div>
      )}
    </li>
  )
}

type RepairButtonProps = {
  character: CharacterWithAllInfo
  structure: BuiltStructureWithAllInfo
}

export function RepairButton({ character, structure }: RepairButtonProps) {
  const { mutate } = useSWRConfig()
  if (structure.durability == structure.structure.maxDurability) return null
  return (
    <li>
      <ProgressButton
        label={
          <p>
            {structure.durability > 0
              ? "Renforcer la structure"
              : "Réparer la structure"}
          </p>
        }
        stamina={structure.structure.repairStamina}
        task={async () => {
          const response = await repair(character.id, structure.id)
          response.success
            ? toast.success(response.message)
            : toast.error(response.message)
          mutate("/api/characters/" + character.id)
        }}
      />
      {structure.structure.repairMaterials.length > 0 && (
        <div className="material">
          {structure.structure.repairMaterials.map((requirement) => (
            <span key={requirement.materialId}>
              <RenderMaterial
                material={requirement.material}
                quantity={requirement.quantity}
                inventory={character.inventory}
              />{" "}
            </span>
          ))}
        </div>
      )}
      <div className="material">
        +
        {Math.round(
          (structure.structure.repairAmount /
            structure.structure.maxDurability) *
            100
        )}
        % solidité
      </div>
    </li>
  )
}
