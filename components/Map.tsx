import { FaCampground } from "react-icons/fa"
import { GiPerson } from "react-icons/gi"
import {
  CellWithBuiltStructures,
  CharacterWithAllInfo,
  TerrainWithActions,
} from "lib/api/types"

type MapProps = {
  character: CharacterWithAllInfo
  terrains: TerrainWithActions[]
}

export default function Map({ character, terrains }: MapProps) {
  const cells = character.map.cells
  const width = Math.max(...cells.map((cell) => cell.y)) + 1
  const height = Math.max(...cells.map((cell) => cell.x)) + 1
  return (
    <>
      <h3>Carte</h3>
      <table>
        <tbody>
          {[...Array(width).keys()].map((y) => (
            <tr key={y}>
              {[...Array(height).keys()].map((x) => {
                const cell = cells.find((cell) => cell.x == x && cell.y == y)
                return (
                  <Cell
                    key={cell.id}
                    x={x}
                    y={y}
                    character={character}
                    cell={cell}
                  />
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

type CellProps = {
  x: number
  y: number
  character: CharacterWithAllInfo
  cell: CellWithBuiltStructures
}

function characterIsAt(character: CharacterWithAllInfo, x: number, y: number) {
  return character.x == x && character.y == y
}

function Cell({ x, y, character, cell }: CellProps) {
  return (
    <td key={cell.id} className={cell.terrainId}>
      {characterIsAt(character, cell.x, cell.y) && <GiPerson />}
      {cell.builtStructures.length > 0 && (
        <div className="structure-marker">
          <FaCampground />
        </div>
      )}
    </td>
  )
}
