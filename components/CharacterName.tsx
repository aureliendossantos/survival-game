import useCharacterAndCell from "lib/queries/useCharacterAndCell"

export default function CharacterName() {
  const { character } = useCharacterAndCell()
  return (
    <>
      <span className="title">{character && character.name} </span>
      <span style={{ fontSize: "x-small", color: "lightgrey" }}>
        Monde {character && character.mapId}
      </span>
    </>
  )
}
