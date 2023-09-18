import { Tool } from "@prisma/client"
import { ToolInstanceWithAllInfo } from "lib/api/types"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"

function getIconSprite(tool: Tool) {
  switch (tool.id) {
    case "hammer":
      return "bg-[-100%_-500%]"
    case "axe":
      return "bg-[-200%_-500%]"
    case "needle":
      return "bg-[-100%_-400%]"
    case "fishingNet":
      return "bg-[-600%_-500%]"
    default:
      return "bg-[-0%_-0%]"
  }
}

type ToolProps = {
  tool: Tool
}

export function RenderToolRequirement({ tool }: ToolProps) {
  const { character } = useCharacterAndCell()
  const requirementMet =
    character &&
    character.inventory.tools.find((entry) => entry.toolId == tool.id)
  return (
    <>
      {/**<span className={!requirementMet && "requirements-not-met"}>
        {tool.title}
      </span>*/}
      <div
        className={`relative -mb-[0.3em] -mt-[0.1em] inline-block h-[1.4em] w-[1.4em] ${
          !requirementMet ? "opacity-50" : ""
        }`}
      >
        <div
          className={`spritesheet ${getIconSprite(tool)}`}
          style={{ filter: "invert(100%)" }}
        />
      </div>
    </>
  )
}

type ToolInstanceProps = {
  tool: ToolInstanceWithAllInfo
}

export function RenderToolInstance({ tool }: ToolInstanceProps) {
  return (
    <span>
      {/**<strong>{tool.tool.title}</strong>{" "}*/}
      <div className="relative -mb-[0.3em] -mt-[0.1em] inline-block h-[1.4em] w-[1.4em]">
        <div
          className={`spritesheet ${getIconSprite(tool.tool)}`}
          style={{ filter: "invert(100%)" }}
        />
      </div>
      <span className="font-medium">
        {Math.round((tool.durability / tool.tool.durability) * 100)}%
      </span>
    </span>
  )
}
