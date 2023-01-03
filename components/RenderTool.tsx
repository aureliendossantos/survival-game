import { Tool } from "@prisma/client"
import { ToolInstanceWithAllInfo } from "lib/api/types"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"

type ToolProps = {
  tool: Tool
}

export function RenderToolRequirement({ tool }: ToolProps) {
  const { character } = useCharacterAndCell()
  const requirementMet =
    character && character.tools.find((entry) => entry.toolId == tool.id)
  return (
    <span className={!requirementMet && "requirements-not-met"}>
      {tool.title}
    </span>
  )
}

type ToolInstanceProps = {
  tool: ToolInstanceWithAllInfo
}

export function RenderToolInstance({ tool }: ToolInstanceProps) {
  return (
    <span>
      <strong>{tool.tool.title}</strong>{" "}
      {Math.round((tool.durability / tool.tool.durability) * 100)}%
    </span>
  )
}
