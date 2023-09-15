import StructureCards, { InventoryActions } from "./Actions"
import Card from "./Card"
import CharacterAttributes from "./CharacterAttributes"
import InventoryCard from "./Inventory"
import Map from "components/Map"
import MapControls from "./MapControls"
import CharactersHere from "./CharactersHere"
import { TerrainCard } from "./LocationInfo"
import CharacterName from "./CharacterName"

export default function GameScreen() {
  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="section">
          <CharacterName />
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
      <Card iconColor="item-icon" icon="book" title="Manuel de survie">
        <div className="buttons-list">
          <InventoryActions />
        </div>
      </Card>
    </>
  )
}
