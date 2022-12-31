import { GetStaticProps, GetStaticPaths } from "next"
import { Toaster } from "react-hot-toast"
import Map from "components/Map"
import prisma from "lib/prisma"
import { useRouter } from "next/router"
import useSWR from "swr"
import {
  CellWithAllInfo,
  CharacterWithAllInfo,
  StructureWithAllInfo,
  TerrainWithActions,
} from "lib/api/types"
import Inventory from "components/Inventory"
import MapControls from "components/MapControls"
import Actions, { InventoryActions } from "components/Actions"
import Card from "components/Card"
import CharacterAttributes from "components/CharacterAttributes"
import LoadingScreen from "components/LoadingScreen"

const fetcher = (url) => fetch(url).then((res) => res.json())

export const getStaticProps: GetStaticProps = async () => {
  const terrains = await prisma.terrain.findMany({
    include: { actions: true },
  })
  const structures = await prisma.structure.findMany({
    include: {
      requiredItems: {
        include: { item: true },
      },
      modules: { select: { id: true } },
    },
  })
  return { props: { terrains, structures } }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
    fallback: true,
  }
}

type Props = {
  terrains: TerrainWithActions[]
  structures: StructureWithAllInfo[]
}

export default function Home({ terrains, structures }: Props) {
  const router = useRouter()
  const { id } = router.query
  const { data: response, error } = useSWR<
    {
      character: CharacterWithAllInfo
      cell: CellWithAllInfo
    },
    Error
  >(id ? `/api/characters/${id}` : null, fetcher, { refreshInterval: 5000 })
  if (router.isFallback || !router.isReady)
    return <LoadingScreen text="Chargement de la page..." percentage={70} />
  if (error)
    return (
      <LoadingScreen
        text={`Erreur ${error.name} : ${error.message}`}
        percentage={100}
        error
      />
    )
  if (!response)
    return <LoadingScreen text="Chargement du personnage..." percentage={100} />
  const character = response.character
  const characterCell = response.cell
  return (
    <>
      <div>
        <Toaster
          toastOptions={{
            duration: 6000,
            error: { duration: 8000, style: { background: "#edd1d1" } },
          }}
        />
      </div>
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
      {characterCell.characters
        .filter((char) => char.id != character.id)
        .map((char) => (
          <p key={char.id}>{char.name} se trouve ici.</p>
        ))}
      <Actions
        character={character}
        cell={characterCell}
        structures={structures}
      />
      <Inventory character={character} />
      <Card iconColor="mountains" icon="book" title="Manuel de survie">
        <div className="buttons-list">
          <InventoryActions character={character} structures={structures} />
        </div>
      </Card>
    </>
  )
}
