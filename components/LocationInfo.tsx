import { Tabs } from "@mui/base/Tabs"
import { Tab, TabPanel, TabsList } from "./Windows/Tabs"
import { BuiltStructureWithAllInfo } from "lib/api/types"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"
import {
  BuildModules,
  CellActions,
  RepairButton,
  StructureActions,
} from "./Actions"
import Card from "./Card"
import { StructureInventory } from "./Inventory"

export function TerrainCard() {
  const { cell } = useCharacterAndCell()
  if (!cell) return null
  return (
    <Card
      iconColor={"tile " + cell.terrain.id}
      title={cell.terrain.title}
      position={"x:" + cell.x + " y:" + cell.y}
      description={cell.terrain.description}
    >
      <ul className="buttons-list">
        <CellActions />
      </ul>
    </Card>
  )
}

type StructureProps = {
  structure: BuiltStructureWithAllInfo
  builtStructures: BuiltStructureWithAllInfo[]
}

export function StructureCard({ structure, builtStructures }: StructureProps) {
  return (
    <div className="structure">
      <Card
        dottedBorder={structure.moduleOfId != null}
        icon={structure.structure.id}
        iconColor={"tile structure-icon"}
        title={structure.structure.title}
        description={structure.structure.description}
        authors={structure.contributors.map((character) => character.name)}
      >
        <StructureInventory structure={structure} />
        <Tabs defaultValue={1}>
          <TabsList>
            <Tab value={1} title="Utiliser" />
            <Tab value={2} title="Améliorer" />
            <Tab value={3} title="Renforcer" />
          </TabsList>
          <TabPanel value={1}>
            <ul className="buttons-list">
              <StructureActions builtStructure={structure} />
            </ul>
          </TabPanel>
          <TabPanel value={2}>
            <ul className="buttons-list">
              <BuildModules builtStructure={structure} />
            </ul>
          </TabPanel>
          <TabPanel value={3}>
            <ul className="buttons-list">
              <RepairButton structure={structure} />
            </ul>
          </TabPanel>
        </Tabs>
        {structure.modules.map((structureModule) => (
          <StructureCard
            key={structureModule.id}
            structure={builtStructures.find(
              (builtStructure) => builtStructure.id == structureModule.id,
            )}
            builtStructures={builtStructures}
          />
        ))}
      </Card>
    </div>
  )
}
