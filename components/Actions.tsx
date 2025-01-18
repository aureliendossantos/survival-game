import { Tabs } from "@mui/base/Tabs"
import { Tab, TabPanel, TabsList } from "./Windows/Tabs"
import { Action, BuiltStructure, Structure } from "@prisma/client"
import query from "lib/query"
import toast from "react-hot-toast"
import { useSWRConfig } from "swr"
import {
  ActionWithRequirements,
  BuiltStructureWithAllInfo,
} from "lib/api/types"
import { MaterialRequirement } from "./RenderMaterial"
import { RenderToolRequirement } from "./RenderTool"
import { StructureCard } from "./LocationInfo"
import ProgressButton from "./ProgressButton/ProgressButton"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"
import useCharacterId from "lib/queries/useCharacterId"
import useStructure from "lib/queries/useStructure"
import ProgressBar from "@ramonak/react-progress-bar"
import { MutableRefObject, ReactNode, useState } from "react"
import { Portal } from "@mui/base"
import Icon from "./Windows/Icon"

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

type BuildButtonProps = {
  structureId: string
  parent?: BuiltStructure
}

export function BuildButton({ structureId, parent }: BuildButtonProps) {
  const { mutate } = useSWRConfig()
  const characterId = useCharacterId()
  const { structure } = useStructure(structureId)
  if (!structure) return null
  return (
    <ActionRow
      title={`Construire un ${structure.title}`}
      iconId={structure.id}
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

export function CharacterActions({
  container,
}: {
  container: MutableRefObject<any>
}) {
  const [selectionId, setSelectionId] = useState<number | null>(null)
  const { character } = useCharacterAndCell()
  if (!character) return null
  const selectedAction =
    selectionId && character.knownActions.find((a) => a.id == selectionId)
  return (
    <Tabs defaultValue={1} onChange={() => setSelectionId(null)}>
      <div className="mb-3 mt-1 flex flex-col rounded bg-bg-900">
        {character.knownActions.map((action) => (
          <label
            key={action.id}
            className="cursor-pointer rounded p-3 transition hover:bg-bg-700 has-[:checked]:bg-bg-600"
          >
            <input
              type="radio"
              name="character-action"
              value={action.id}
              onChange={(e) => setSelectionId(Number(e.target.value))}
              className="hidden"
            />
            <div className="flex">
              <Icon id={action.id} size="1lh" />
              {action.title}
            </div>
          </label>
        ))}
      </div>
      {selectedAction && (
        <Portal container={() => container.current}>
          <ActionDetails action={selectedAction} />
        </Portal>
      )}
    </Tabs>
  )
}

export function StructureActions({
  builtStructure,
}: {
  builtStructure: BuiltStructureWithAllInfo
}) {
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

type ActionRowProps = {
  title: string
  iconId: string | number
  iconType?: "primary" | "secondary"
  stamina: number
  progress?: { title: string; value: number; max: number }
  task: () => Promise<void>
  children?: ReactNode
}

function ActionRow({
  title,
  iconId,
  iconType,
  stamina,
  progress,
  task,
  children,
}: ActionRowProps) {
  return (
    <li>
      <div className="flex rounded bg-bg-950">
        <ProgressButton
          iconId={iconId}
          type={iconType}
          stamina={stamina}
          task={task}
          disabled={progress && progress.value == progress.max}
        />
        <div className="flex grow flex-col justify-between px-3 py-2">
          <div className="font-semibold">{title}</div>
          <div className="flex gap-[3px]">{children}</div>
          {progress && (
            <ProgressBar
              completed={String(progress.value)}
              maxCompleted={progress.max}
              customLabel={progress.title}
              bgColor="#b47141"
              height="4px"
              borderRadius="2px"
              baseBgColor="#332A28"
              isLabelVisible={false}
              transitionDuration="0.5s"
              transitionTimingFunction="ease-out"
            />
          )}
        </div>
      </div>
    </li>
  )
}

export function ActionDetails({ action }: { action: ActionWithRequirements }) {
  const { mutate } = useSWRConfig()
  const characterId = useCharacterId()
  return (
    <>
      <h3>{action.title}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
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
          {action.probability < 100 && (
            <div className="material">{action.probability}% réussite</div>
          )}
        </div>
        <div>
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
        </div>
      </div>
      <div className="flex justify-end">
        <ProgressButton
          label="Confectionner"
          stamina={action.stamina}
          task={async () => {
            const response = await doAction(characterId, action.id)
            response.success
              ? toast.success(response.message)
              : toast.error(response.message)
            mutate("/api/characters/" + characterId)
          }}
        />
      </div>
    </>
  )
}

export function ActionButton({ action }: { action: ActionWithRequirements }) {
  const { mutate } = useSWRConfig()
  const characterId = useCharacterId()
  return (
    <ActionRow
      title={action.title}
      iconId={action.id}
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

export function RepairButton({
  structure,
}: {
  structure: BuiltStructureWithAllInfo
}) {
  const { mutate } = useSWRConfig()
  const characterId = useCharacterId()
  return (
    <ActionRow
      title={
        structure.durability > 0
          ? "Renforcer la structure"
          : "Réparer la structure"
      }
      iconId="repair"
      stamina={structure.structure.repairStamina}
      progress={{
        title: "Solidité",
        value: structure.durability,
        max: structure.structure.maxDurability,
      }}
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
      <ProgressBar
        completed={String(structure.durability)}
        maxCompleted={structure.structure.maxDurability}
        bgColor="#b47141"
        height="4px"
        borderRadius="0"
        baseBgColor="#332A28"
        isLabelVisible={false}
        transitionDuration="0.5s"
        transitionTimingFunction="ease-out"
      />
    </ActionRow>
  )
}
