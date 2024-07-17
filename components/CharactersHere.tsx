import useCharacterId from "lib/queries/useCharacterId"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"

/**
 * Returns a list of other players on the same cell.
 */
export default function CharactersHere() {
  const { cell } = useCharacterAndCell()
  const characterId = useCharacterId()
  if (!characterId || !cell) return null
  const neighbours = cell.characters.filter((char) => char.id != characterId)
  if (neighbours.length == 0) return null
  return (
    <div className="section text-[smaller]">
      {neighbours.map((char) => (
        <p key={char.id}>{char.name} se trouve ici.</p>
      ))}
    </div>
  )
}
