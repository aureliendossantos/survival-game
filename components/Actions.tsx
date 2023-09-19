import { Action, BuiltStructure, Structure } from "@prisma/client"
import query from "lib/query"
import toast from "react-hot-toast"
import { useSWRConfig } from "swr"
import {
  ActionWithRequirements,
  BuiltStructureWithAllInfo,
  StructureWithAllInfo,
} from "lib/api/types"
import { MaterialRequirement } from "./RenderMaterial"
import { RenderToolRequirement } from "./RenderTool"
import { StructureCard } from "./LocationInfo"
import ProgressButton from "./ProgressButton/ProgressButton"
import useStructures from "lib/queries/useStructures"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"
import useCharacterId from "lib/queries/useCharacterId"
import useStructure from "lib/queries/useStructure"

async function doAction(characterId: string, actionId: number) {
  const body = {
    id: actionId,
  }
  return await query(
    "/api/characters/" + characterId + "/action",
    "PATCH",
    body,
  )
}

async function repair(characterId: string, builtStructureId: string) {
  const body = {
    id: builtStructureId,
  }
  return await query(
    "/api/characters/" + characterId + "/repair",
    "PATCH",
    body,
  )
}

async function build(
  characterId: string,
  structureId: string,
  parentBuiltStructureId?: string,
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
  // TEMP: Might later be the list of structureIds the character
  // learned about. It will allow us to remove useStructures(),
  // which returns every structure in the game, which is not ideal.
  if (!structures) return null
  return (
    <>
      {structures
        .filter((structure) => structure.moduleOfId == null)
        .map((structure) => (
          <BuildButton key={structure.id} structureId={structure.id} />
        ))}
    </>
  )
}

type BuildModulesProps = {
  builtStructure: BuiltStructureWithAllInfo
}

export function BuildModules({ builtStructure }: BuildModulesProps) {
  const { structure } = useStructure(builtStructure.structureId)
  if (!structure || builtStructure.durability == 0) return null
  return (
    <>
      {structure.modules.map((builtStructureModule) => {
        return (
          <BuildButton
            key={builtStructureModule.id}
            structureId={builtStructureModule.id}
            parent={builtStructure}
          />
        )
      })}
    </>
  )
}

function getStructureIcon(structure: Structure) {
  switch (structure.id) {
    case "camp":
      return "bg-[-600%_-300%]"
    case "workbench":
      return "bg-[-400%_-500%]"
    case "chest":
      return "bg-[-500%_-500%]"
    default:
      return "bg-[-0%_-0%]"
  }
}

type BuildButtonProps = {
  structureId: string
  parent?: BuiltStructure
}

function BuildButton({ structureId, parent }: BuildButtonProps) {
  const { mutate } = useSWRConfig()
  const characterId = useCharacterId()
  const { structure } = useStructure(structureId)
  if (!structure) return null
  return (
    <ActionRow
      title={`Construire un ${structure.title}`}
      iconClass={getStructureIcon(structure)}
      iconType="secondary"
      stamina={structure.requiredStamina}
      task={async () => {
        const response = await build(
          characterId,
          structure.id,
          parent && parent.id,
        )
        response.success
          ? toast.success(response.message)
          : toast.error(response.message)
        mutate("/api/characters/" + characterId)
      }}
    >
      <div className="material">
        {structure.requiredMaterials.map((requirement) => (
          <span key={requirement.materialId}>
            <MaterialRequirement
              material={requirement.material}
              quantity={requirement.quantity}
            />{" "}
          </span>
        ))}
      </div>
    </ActionRow>
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
      {character.inventory.materials.map((entry) =>
        entry.material.inActionCost
          .filter((entry) => entry.action.structureId == null)
          .map((entry) => (
            <ActionButton key={entry.action.id} action={entry.action} />
          )),
      )}
    </>
  )
}

type StructureActionsProps = {
  builtStructure: BuiltStructureWithAllInfo
}

export function StructureActions({ builtStructure }: StructureActionsProps) {
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

function getActionIcon(action: Action) {
  switch (action.id) {
    case 1:
      return "bg-[-200%_-400%]"
    case 2:
      return "bg-[-100%_-0%]"
    case 4:
      return "bg-[-200%_-0%]"
    case 6:
      return "bg-[-100%_-500%]"
    case 7:
      return "bg-[-200%_-500%]"
    case 8:
      return "bg-[-100%_-400%]"
    case 9:
      return "bg-[-0%_-400%]"
    case 10:
      return "bg-[-600%_-400%]"
    case 11:
      return "bg-[-600%_-500%]"
    case 13:
      return "bg-[-700%_-400%]"
    default:
      return "bg-[-0%_-0%]"
  }
}

function ActionRow({
  title,
  iconClass,
  iconType,
  stamina,
  task,
  children,
}: any) {
  return (
    <li>
      <div className="flex rounded bg-[#1c1817]">
        <ProgressButton
          iconClass={iconClass}
          type={iconType}
          stamina={stamina}
          task={task}
        />
        <div className="flex flex-col justify-between py-2 pl-3">
          <div className="font-semibold">{title}</div>
          <div className="flex gap-[3px]">{children}</div>
        </div>
      </div>
    </li>
  )
}

type ActionButtonProps = {
  action: ActionWithRequirements
}

export function ActionButton({ action }: ActionButtonProps) {
  const { mutate } = useSWRConfig()
  const characterId = useCharacterId()
  return (
    <ActionRow
      title={action.title}
      iconClass={getActionIcon(action)}
      stamina={action.stamina}
      task={async () => {
        const response = await doAction(characterId, action.id)
        response.success
          ? toast.success(response.message)
          : toast.error(response.message)
        mutate("/api/characters/" + characterId)
      }}
    >
      {action.requiredTools.length > 0 && (
        <div className="material">
          {/**"Outil requis : "*/}
          {action.requiredTools.map((tool) => (
            <span key={tool.id}>
              <RenderToolRequirement tool={tool} />{" "}
            </span>
          ))}
        </div>
      )}
      {action.requiredMaterials.length > 0 && (
        <div className="material">
          {action.requiredMaterials.map((requirement) => (
            <span key={requirement.materialId}>
              <MaterialRequirement
                material={requirement.material}
                quantity={requirement.quantity}
              />{" "}
            </span>
          ))}
        </div>
      )}
      {action.probability < 100 && (
        <div className="material">{action.probability}% réussite</div>
      )}
    </ActionRow>
  )
}

type RepairButtonProps = {
  structure: BuiltStructureWithAllInfo
}

export function RepairButton({ structure }: RepairButtonProps) {
  const { mutate } = useSWRConfig()
  const characterId = useCharacterId()
  if (structure.durability == structure.structure.maxDurability) return null
  return (
    <ActionRow
      title={
        structure.durability > 0
          ? "Renforcer la structure"
          : "Réparer la structure"
      }
      iconClass="bg-[-700%_-500%]"
      stamina={structure.structure.repairStamina}
      task={async () => {
        const response = await repair(characterId, structure.id)
        response.success
          ? toast.success(response.message)
          : toast.error(response.message)
        mutate("/api/characters/" + characterId)
      }}
    >
      {structure.structure.repairMaterials.length > 0 && (
        <div className="material">
          {structure.structure.repairMaterials.map((requirement) => (
            <span key={requirement.materialId}>
              <MaterialRequirement
                material={requirement.material}
                quantity={requirement.quantity}
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
            100,
        )}
        % solidité
      </div>
    </ActionRow>
  )
}
