import { Action, BuiltStructure } from "@prisma/client"
import query from "lib/query"
import toast from "react-hot-toast"
import { useSWRConfig } from "swr"
import {
  BuiltStructureWithAllInfo,
  CellWithAllInfo,
  CharacterWithInventoryAndMap,
  StructureWithAllInfo,
} from "types/api"
import { StructureInfo, TerrainInfo } from "./LocationInfo"
import ProgressButton from "./ProgressButton/ProgressButton"

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

async function build(
  characterId: string,
  structureId: number,
  parentBuiltStructureId?: string
) {
  const body = {
    id: structureId,
    parentId: parentBuiltStructureId,
  }
  return await query("/api/characters/" + characterId + "/build", "PATCH", body)
}

type ActionsProps = {
  character: CharacterWithInventoryAndMap
  cell: CellWithAllInfo
  structures: StructureWithAllInfo[]
}

export default function Actions({ character, cell, structures }: ActionsProps) {
  return (
    <>
      <TerrainInfo character={character} cell={cell} structures={structures} />
      {cell.builtStructures
        .filter((structure) => structure.moduleOfId == null)
        .map((structure) => (
          <StructureInfo
            key={structure.id}
            character={character}
            structure={structure}
            builtStructures={cell.builtStructures}
            structures={structures}
          />
        ))}
    </>
  )
}

type BuildStartersProps = {
  character: CharacterWithInventoryAndMap
  structures: StructureWithAllInfo[]
}

export function BuildStarters({ character, structures }: BuildStartersProps) {
  return (
    <>
      {structures
        .filter((structure) => structure.moduleOfId == null)
        .map((structure) => (
          <BuildButton
            key={structure.id}
            character={character}
            structure={structure}
          />
        ))}
    </>
  )
}

type BuildModulesProps = {
  character: CharacterWithInventoryAndMap
  builtStructure: BuiltStructureWithAllInfo
  structures: StructureWithAllInfo[]
}

export function BuildModules({
  character,
  builtStructure,
  structures,
}: BuildModulesProps) {
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
              character={character}
              structure={structureModule}
              parent={builtStructure}
            />
          )
        })}
    </>
  )
}

type BuildButtonProps = {
  character: CharacterWithInventoryAndMap
  structure: StructureWithAllInfo
  parent?: BuiltStructure
}

function BuildButton({ character, structure, parent }: BuildButtonProps) {
  const { mutate } = useSWRConfig()
  return (
    <li>
      <ProgressButton
        label={<p>Construire un {structure.title}</p>}
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
      <div className="item">
        {structure.requiredItems.map((requirement) => (
          <>
            <strong>{requirement.quantity}</strong> {requirement.item.title}{" "}
          </>
        ))}
      </div>
    </li>
  )
}

type CellActionsProps = {
  character: CharacterWithInventoryAndMap
  cell: CellWithAllInfo
}

export function CellActions({ character, cell }: CellActionsProps) {
  return (
    <>
      {cell.terrain.actions.map((action) => (
        <ActionButton key={action.id} character={character} action={action} />
      ))}
    </>
  )
}

type StructureActionsProps = {
  character: CharacterWithInventoryAndMap
  builtStructure: BuiltStructureWithAllInfo
}

export function StructureActions({
  character,
  builtStructure,
}: StructureActionsProps) {
  return (
    <>
      {builtStructure.structure.actions.map((action) => (
        <ActionButton key={action.id} character={character} action={action} />
      ))}
    </>
  )
}

type ActionButtonProps = {
  character: CharacterWithInventoryAndMap
  action: Action
}

export function ActionButton({ character, action }: ActionButtonProps) {
  const { mutate } = useSWRConfig()
  return (
    <li>
      <ProgressButton
        label={<p>{action.title}</p>}
        task={async () => {
          const response = await doAction(character.id, action.id)
          response.success
            ? toast.success(response.message)
            : toast.error(response.message)
          mutate("/api/characters/" + character.id)
        }}
      />
      {action.probability < 100 && (
        <div className="item">{action.probability}% réussite</div>
      )}
    </li>
  )
}
