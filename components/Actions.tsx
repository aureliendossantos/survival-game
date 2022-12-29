import { BuiltStructure } from "@prisma/client"
import query from "lib/query"
import toast from "react-hot-toast"
import { useSWRConfig } from "swr"
import {
  ActionWithRequirements,
  BuiltStructureWithAllInfo,
  CellWithAllInfo,
  CharacterWithAllInfo,
  StructureWithAllInfo,
} from "types/api"
import RenderItem, { RenderToolRequirement } from "./RenderItem"
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
  character: CharacterWithAllInfo
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
  character: CharacterWithAllInfo
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
  character: CharacterWithAllInfo
  builtStructure: BuiltStructureWithAllInfo
  structures: StructureWithAllInfo[]
}

export function BuildModules({
  character,
  builtStructure,
  structures,
}: BuildModulesProps) {
  if (builtStructure.durability == 0) return null
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
  character: CharacterWithAllInfo
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
          <span key={requirement.itemId}>
            <RenderItem
              item={requirement.item}
              quantity={requirement.quantity}
              inventory={character.inventory}
            />{" "}
          </span>
        ))}
      </div>
    </li>
  )
}

type CellActionsProps = {
  character: CharacterWithAllInfo
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

type InventoryActionsProps = {
  character: CharacterWithAllInfo
  structures: StructureWithAllInfo[]
}

export function InventoryActions({
  character,
  structures,
}: InventoryActionsProps) {
  return (
    <>
      <BuildStarters character={character} structures={structures} />
      {character.inventory.map((entry) =>
        entry.item.inActionCost
          .filter((entry) => entry.action.structureId == null)
          .map((entry) => (
            <ActionButton
              key={entry.action.id}
              character={character}
              action={entry.action}
            />
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
        <ActionButton key={action.id} character={character} action={action} />
      ))}
    </>
  )
}

type ActionButtonProps = {
  character: CharacterWithAllInfo
  action: ActionWithRequirements
}

export function ActionButton({ character, action }: ActionButtonProps) {
  const { mutate } = useSWRConfig()
  return (
    <li>
      <ProgressButton
        label={action.title}
        dots={action.stamina < 0 ? -action.stamina : 0}
        task={async () => {
          const response = await doAction(character.id, action.id)
          response.success
            ? toast.success(response.message)
            : toast.error(response.message)
          mutate("/api/characters/" + character.id)
        }}
      />
      {action.requiredItems.length > 0 && (
        <div className="item">
          {action.requiredItems.map((requirement) => (
            <span key={requirement.itemId}>
              <RenderItem
                item={requirement.item}
                quantity={requirement.quantity}
                inventory={character.inventory}
              />{" "}
            </span>
          ))}
        </div>
      )}
      {action.requiredTools.length > 0 && (
        <div className="item">
          {"Outils : "}
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
        <div className="item">{action.probability}% réussite</div>
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
        task={async () => {
          const response = await repair(character.id, structure.id)
          response.success
            ? toast.success(response.message)
            : toast.error(response.message)
          mutate("/api/characters/" + character.id)
        }}
      />
      {structure.structure.repairMaterials.length > 0 && (
        <div className="item">
          {structure.structure.repairMaterials.map((requirement) => (
            <span key={requirement.itemId}>
              <RenderItem
                item={requirement.item}
                quantity={requirement.quantity}
                inventory={character.inventory}
              />{" "}
            </span>
          ))}
        </div>
      )}
      <div className="item">
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
