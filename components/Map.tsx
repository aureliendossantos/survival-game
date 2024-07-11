import { FaCampground } from "react-icons/fa"
import { GiPerson } from "react-icons/gi"
import { CellWithBuiltStructures, CharacterWithAllInfo } from "lib/api/types"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"

export default function Map() {
  const { character } = useCharacterAndCell()
  if (!character) return null
  const cells = character.map.cells
  const width = Math.max(...cells.map((cell) => cell.y)) + 1
  const height = Math.max(...cells.map((cell) => cell.x)) + 1
  return (
    <>
      <h3 className="mt-2">Carte</h3>
      <table className="m-auto mb-[9px] rounded-[5px] border-4 border-[#593233] bg-[#2b1f1c]">
        <tbody>
          {[...Array(width).keys()].map((y) => (
            <tr key={y}>
              {[...Array(height).keys()].map((x) => {
                const cell = cells.find((cell) => cell.x == x && cell.y == y)
                return <Cell key={cell.id} cell={cell} />
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

type CellProps = {
  cell: CellWithBuiltStructures
}

function characterIsAt(character: CharacterWithAllInfo, x: number, y: number) {
  return character.x == x && character.y == y
}

function Cell({ cell }: CellProps) {
  const { character } = useCharacterAndCell()
  if (!character) return null
  return (
    <td key={cell.id} className={`relative h-[50px] w-[50px] p-0`}>
      <div className={cell.terrainId} />
      {cell.builtStructures.length > 0 && (
        <div className="spritesheet bg-[-600%_-300%]" />
      )}
      {characterIsAt(character, cell.x, cell.y) && (
        <div className="spritesheet bg-[-600%_-200%]" />
      )}
    </td>
  )
}
