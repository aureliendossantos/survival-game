import {
  BuiltStructureWithAllInfo,
  CellWithAllInfo,
  CharacterWithInventoryAndMap,
  StructureWithAllInfo,
} from "types/api"
import {
  BuildModules,
  BuildStarters,
  CellActions,
  InventoryActions,
  RepairButton,
  StructureActions,
} from "./Actions"
import Card from "./Card"

type LocationInfoProps = {
  cell: CellWithAllInfo
}

export default function LocationInfo({ cell }: LocationInfoProps) {
  return (
    <div className="location">
      <h4>À votre emplacement :</h4>
    </div>
  )
}

type TerrainInfoProps = {
  character: CharacterWithInventoryAndMap
  cell: CellWithAllInfo
  structures: StructureWithAllInfo[]
}

export function TerrainInfo({ character, cell, structures }: TerrainInfoProps) {
  return (
    <Card
      iconColor={"tile " + cell.terrain.id}
      title={cell.terrain.title}
      position={"x:" + cell.x + " y:" + cell.y}
      description={cell.terrain.description}
    >
      <div className="buttons-list">
        <CellActions character={character} cell={cell} />
      </div>
    </Card>
  )
}

type StructureProps = {
  character: CharacterWithInventoryAndMap
  structure: BuiltStructureWithAllInfo
  builtStructures: BuiltStructureWithAllInfo[]
  structures: StructureWithAllInfo[]
}

export function StructureInfo({
  character,
  structure,
  builtStructures,
  structures,
}: StructureProps) {
  return (
    <div className="structure">
      <Card
        dottedBorder={structure.moduleOfId != null}
        icon={structure.structure.id == 2 ? "bench" : "camp"}
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
          <StructureActions character={character} builtStructure={structure} />
          <BuildModules
            character={character}
            builtStructure={structure}
            structures={structures}
          />
          <RepairButton character={character} structure={structure} />
        </div>
        {structure.modules.map((structureModule) => (
          <StructureInfo
            key={structureModule.id}
            character={character}
            structure={builtStructures.find(
              (builtStructure) => builtStructure.id == structureModule.id
            )}
            builtStructures={builtStructures}
            structures={structures}
          />
        ))}
      </Card>
    </div>
  )
}
