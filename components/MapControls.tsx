import query from "lib/query"
import toast from "react-hot-toast"
import {
  ImArrowDown2,
  ImArrowLeft2,
  ImArrowRight2,
  ImArrowUp2,
} from "react-icons/im"
import { useSWRConfig } from "swr"
import ProgressButton from "./ProgressButton/ProgressButton"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"

async function moveCharacter(id: string, x: number, y: number, mapId: number) {
  const body = {
    dirX: x,
    dirY: y,
    mapId: mapId,
    characterId: id,
  }
  return await query("/api/characters/" + id + "/move", "PATCH", body)
}

export default function MapControls() {
  const { mutate } = useSWRConfig()
  const { character } = useCharacterAndCell()
  if (!character) return null
  const map = character.map.cells
  const directions = [
    { x: -1, y: 0, label: <ImArrowLeft2 key={0} /> },
    { x: 0, y: -1, label: <ImArrowUp2 key={1} /> },
    { x: 0, y: 1, label: <ImArrowDown2 key={2} /> },
    { x: 1, y: 0, label: <ImArrowRight2 key={3} /> },
  ]
  return (
    <div style={{ textAlign: "center" }}>
      {directions.map((dir, index) => {
        const targetCell = map.find(
          (cell) =>
            cell.x == character.x + dir.x && cell.y == character.y + dir.y,
        )
        const disabled = !targetCell || targetCell.terrainId == "sea"
        const stamina = disabled
          ? 0
          : targetCell.terrainId == "forest"
          ? -1
          : targetCell.terrainId == "mountains"
          ? -2
          : 0
        return (
          <ProgressButton
            key={index}
            label={dir.label}
            stamina={stamina}
            disabled={disabled}
            iconSize={true}
            task={async () => {
              if (!disabled) {
                const response = await moveCharacter(
                  character.id,
                  dir.x,
                  dir.y,
                  character.mapId,
                )
                !response.success && toast.error(response.message)
                mutate("/api/characters/" + character.id)
              }
            }}
          />
        )
      })}
    </div>
  )
}
