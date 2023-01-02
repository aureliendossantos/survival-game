import StructureCards, { InventoryActions } from "./Actions"
import Card from "./Card"
import CharacterAttributes from "./CharacterAttributes"
import InventoryCard from "./Inventory"
import Map from "components/Map"
import MapControls from "./MapControls"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"
import CharactersHere from "./CharactersHere"
import { TerrainCard } from "./LocationInfo"

export default function GameScreen() {
  const { character } = useCharacterAndCell()
  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="section">
          <span className="title">{character && character.name} </span>
          <span style={{ fontSize: "x-small", color: "lightgrey" }}>
            Monde {character && character.mapId}
          </span>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div className="section">
          <Map />
          <MapControls />
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div className="section">
          <CharacterAttributes />
        </div>
      </div>
      <CharactersHere />
      <TerrainCard />
      <StructureCards />
      <InventoryCard />
      <Card iconColor="mountains" icon="book" title="Manuel de survie">
        <div className="buttons-list">
          <InventoryActions />
        </div>
      </Card>
    </>
  )
}
