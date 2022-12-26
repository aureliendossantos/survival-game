import { GetStaticProps, GetStaticPaths } from "next"
import { Toaster } from "react-hot-toast"
import Map from "components/Map"

import prisma from "lib/prisma"

import { useRouter } from "next/router"
import useSWR from "swr"
import {
  CellWithAllInfo,
  CharacterWithInventoryAndMap,
  StructureWithAllInfo,
  TerrainWithActions,
} from "types/api"
import Inventory from "components/Inventory"
import MapControls from "components/MapControls"
import query from "lib/query"
import Actions from "components/Actions"

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

async function giveItem(characterId, itemId, quantity) {
  const body = {
    id: itemId,
    quantity: quantity,
  }
  return await query(
    "/api/characters/" + characterId + "/inventory",
    "PATCH",
    body
  )
}

type Props = {
  terrains: TerrainWithActions[]
  structures: StructureWithAllInfo[]
}

export default function Home({ terrains, structures }: Props) {
  const router = useRouter()
  const { data: response, error } = useSWR<
    {
      character: CharacterWithInventoryAndMap
      cell: CellWithAllInfo
    },
    Error
  >("/api/characters/" + router.query.id, fetcher, { refreshInterval: 5000 })
  if (router.isFallback)
    return (
      <div className="loading">
        <progress id="loading" max="10" value="3"></progress>
        <label htmlFor="loading">
          <p>Chargement de la page...</p>
        </label>
      </div>
    )
  if (error)
    return (
      <div className="loading">
        <p>
          Erreur {error.name} : {error.message}
        </p>
      </div>
    )
  if (!response)
    return (
      <div className="loading">
        <progress id="loading" max="10" value="7"></progress>
        <label htmlFor="loading">
          <p>Chargement du personnage...</p>
        </label>
      </div>
    )
  const character = response.character
  const characterCell = response.cell
  return (
    <>
      <div>
        <Toaster />
      </div>
      <p className="title">{character.name}</p>
      <label htmlFor="energy">Énergie</label>
      <progress id="energy" max="10" value={character.stamina}></progress>
      <div className="buttons-list">
        <div className="section">
          <Map character={character} terrains={terrains} />
          <MapControls character={character} />
        </div>
      </div>
      <Actions
        character={character}
        cell={characterCell}
        structures={structures}
      />
      <div className="section">
        <h3>Inventaire</h3>
        <div className="buttons-list">
          <Inventory character={character} />
        </div>
      </div>
    </>
  )
}
