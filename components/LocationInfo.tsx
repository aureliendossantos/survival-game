import { BuiltStructureWithAllInfo } from "lib/api/types"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"
import {
  BuildModules,
  CellActions,
  RepairButton,
  StructureActions,
} from "./Actions"
import Card from "./Card"

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
      <div className="buttons-list">
        <CellActions />
      </div>
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
        author={structure.contributors.map(
          (character) => "🧑‍🦰 " + character.name
        )}
        contents={[
          "Solidité : " +
            Math.round(
              (structure.durability / structure.structure.maxDurability) * 100
            ) +
            "%",
        ]}
      >
        <div className="buttons-list">
          <StructureActions builtStructure={structure} />
          <BuildModules builtStructure={structure} />
          <RepairButton structure={structure} />
        </div>
        {structure.modules.map((structureModule) => (
          <StructureCard
            key={structureModule.id}
            structure={builtStructures.find(
              (builtStructure) => builtStructure.id == structureModule.id
            )}
            builtStructures={builtStructures}
          />
        ))}
      </Card>
    </div>
  )
}
