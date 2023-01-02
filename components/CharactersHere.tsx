import useCharacterAndCell from "lib/queries/useCharacterAndCell"

/**
 * Returns a list of other players on the same cell.
 */
export default function CharactersHere() {
  const { character, cell } = useCharacterAndCell()
  if (!character || !cell) return null
  return (
    <>
      {cell.characters
        .filter((char) => char.id != character.id)
        .map((char) => (
          <p key={char.id}>{char.name} se trouve ici.</p>
        ))}
    </>
  )
}
