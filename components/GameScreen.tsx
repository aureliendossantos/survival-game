import {
  CharacterWithAllInfo,
  CellWithAllInfo,
  StructureWithAllInfo,
  TerrainWithActions,
} from "lib/api/types"
import Actions, { InventoryActions } from "./Actions"
import Card from "./Card"
import CharacterAttributes from "./CharacterAttributes"
import Inventory from "./Inventory"
import Map from "components/Map"
import MapControls from "./MapControls"

type GameScreenProps = {
  terrains: TerrainWithActions[]
  structures: StructureWithAllInfo[]
  character: CharacterWithAllInfo
  cell: CellWithAllInfo
}

export default function GameScreen({
  terrains,
  structures,
  character,
  cell,
}: GameScreenProps) {
  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="section">
          <span className="title">{character.name} </span>
          <span style={{ fontSize: "x-small", color: "lightgrey" }}>
            Monde {character.mapId}
          </span>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div className="section">
          <Map character={character} terrains={terrains} />
          <MapControls character={character} />
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div className="section">
          <CharacterAttributes character={character} />
        </div>
      </div>
      {cell.characters
        .filter((char) => char.id != character.id)
        .map((char) => (
          <p key={char.id}>{char.name} se trouve ici.</p>
        ))}
      <Actions character={character} cell={cell} structures={structures} />
      <Inventory character={character} />
      <Card iconColor="mountains" icon="book" title="Manuel de survie">
        <div className="buttons-list">
          <InventoryActions character={character} structures={structures} />
        </div>
      </Card>
    </>
  )
}
