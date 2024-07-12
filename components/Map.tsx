import { CellWithBuiltStructures, CharacterWithAllInfo } from "lib/api/types"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"

/**
 * Similar to Map() but the sizes automatically adjust to show every known cell. Too big for the game screen but might be useful someday for a full map view.
 */
function FullMap() {
  const { character } = useCharacterAndCell()
  if (!character) return null
  const cells = character.canSeeCells
  if (cells.length == 0) return null
  // Calculate the width based on the distance between the lowest and highest x
  const minWidth = Math.min(...cells.map((cell) => cell.x))
  const maxWidth = Math.max(...cells.map((cell) => cell.x))
  const width = maxWidth - minWidth + 1
  const minHeight = Math.min(...cells.map((cell) => cell.y))
  const maxHeight = Math.max(...cells.map((cell) => cell.y))
  const height = maxHeight - minHeight + 1
  // array with every existing x coordinate, starting from minWidth
  const widths = [...Array(width).keys()].map((w) => w + minWidth)
  const heights = [...Array(height).keys()].map((h) => h + minHeight)
  console.log("widths", widths, "heights", heights)
  return (
    <div
      className="m-auto mb-[9px] grid w-fit gap-0 border-4 border-[#593233] bg-[#1c1817]"
      style={{
        gridTemplateColumns: `repeat(${width}, 50px)`,
        gridAutoRows: "50px",
      }}
    >
      {heights.map((h) =>
        widths.map((w) => {
          const cell = cells.find((cell) => cell.x == w && cell.y == h)
          if (!cell) return <div key={`x${w}y${h}`} />
          return <Cell key={`x${w}y${h}`} cell={cell} />
        }),
      )}
    </div>
  )
}

export default function Map() {
  const { character } = useCharacterAndCell()
  if (!character) return null
  const cells = character.canSeeCells
  if (cells.length == 0) return null
  const widths = [
    character.x - 2,
    character.x - 1,
    character.x,
    character.x + 1,
    character.x + 2,
  ]
  const heights = [
    character.y - 2,
    character.y - 1,
    character.y,
    character.y + 1,
    character.y + 2,
  ]
  return (
    <div
      className="m-auto mb-[9px] grid w-fit gap-0 border-4 border-[#593233] bg-[#1c1817]"
      style={{
        gridTemplateColumns: `repeat(5, 50px)`,
        gridAutoRows: "50px",
      }}
    >
      {heights.map((y) =>
        widths.map((x) => {
          const cell = cells.find((cell) => cell.x == x && cell.y == y)
          if (!cell) return <div key={`x${x}y${y}`} />
          return <Cell key={`x${x}y${y}`} cell={cell} />
        }),
      )}
    </div>
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
    <div key={cell.id} className={`relative h-[50px] w-[50px] p-0`}>
      <div className={cell.terrainId} />
      {cell.builtStructures.length > 0 && (
        <div className="spritesheet bg-[-600%_-300%]" />
      )}
      {characterIsAt(character, cell.x, cell.y) && (
        <div className="spritesheet bg-[-600%_-200%]" />
      )}
    </div>
  )
}
