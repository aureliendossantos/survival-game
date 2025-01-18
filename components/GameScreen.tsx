import StructureCards, { BuildButton, CharacterActions } from "./Actions"
import Card from "./Card"
import CharacterAttributes from "./CharacterAttributes"
import InventoryCard from "./Inventory"
import Map from "components/Map"
import MapControls from "./MapControls"
import CharactersHere from "./CharactersHere"
import { TerrainCard } from "./LocationInfo"
import CharacterName from "./CharacterName"
import { MainTabs, TabPanel } from "./Windows/Tabs"
import { useRef } from "react"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"

export default function GameScreen() {
  const container = useRef(null)
  const { character } = useCharacterAndCell()
  if (!character) return null
  return (
    <div className="flex min-h-svh flex-col gap-[9px]">
      <div style={{ display: "flex" }}>
        <div className="section">
          <CharacterName />
        </div>
      </div>
      <div className="section sticky top-0 z-10">
        <CharacterAttributes />
      </div>
      <CharactersHere />
      <MainTabs container={container}>
        <TabPanel value={1}>
          <div className="section">
            <Map />
            <MapControls />
          </div>
          <TerrainCard />
          <StructureCards />
          <Card iconColor="item-icon" icon="book" title="Construction">
            <ul className="buttons-list">
              {character.knownStructures.map((structure) => (
                <BuildButton key={structure.id} structureId={structure.id} />
              ))}
            </ul>
          </Card>
        </TabPanel>
        <TabPanel value={2}>
          <InventoryCard />
          <Card iconColor="item-icon" icon="book" title="Fabrication">
            <ul className="buttons-list">
              <CharacterActions container={container} />
            </ul>
          </Card>
        </TabPanel>
      </MainTabs>
    </div>
  )
}
