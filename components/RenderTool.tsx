import { Tool } from "@prisma/client"
import { ToolInstanceWithAllInfo } from "lib/api/types"

type ToolProps = {
  tool: Tool
  toolInventory?: ToolInstanceWithAllInfo[]
}

export function RenderToolRequirement({ tool, toolInventory }: ToolProps) {
  return (
    <span
      style={
        toolInventory
          ? toolInventory.find((entry) => entry.toolId == tool.id)
            ? null
            : { color: "grey" }
          : null
      }
    >
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
