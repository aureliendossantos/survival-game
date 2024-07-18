import { BuiltStructureWithAllInfo } from "lib/api/types"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"
import {
  BuildModules,
  CellActions,
  RepairButton,
  StructureActions,
} from "./Actions"
import Card from "./Card"
import { Food, Materials, StructureInventory, Tools } from "./Inventory"

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
        <ul className="buttons-list">
          <StructureActions builtStructure={structure} />
          <BuildModules builtStructure={structure} />
          <RepairButton structure={structure} />
        </ul>
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
