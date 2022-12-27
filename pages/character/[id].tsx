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
import Actions, { InventoryActions } from "components/Actions"
import ProgressBar from "@ramonak/react-progress-bar"
import Card from "components/Card"

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

async function giveItem(characterId: string, itemId: number, quantity: number) {
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

type LoadingHomeProps = {
  text: string
  percentage: number
  error?: boolean
}

function LoadingHome({ text, percentage, error }: LoadingHomeProps) {
  return (
    <div className="loading">
      <ProgressBar
        animateOnRender
        isLabelVisible={false}
        completed={percentage}
        bgColor={error ? "pink" : "#2b6eff"}
        width="150px"
        margin="6px 0"
      />
      <p>{text}</p>
    </div>
  )
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
      character: CharacterWithInventoryAndMap
      cell: CellWithAllInfo
    },
    Error
  >(id ? `/api/characters/${id}` : null, fetcher, { refreshInterval: 5000 })
  if (router.isFallback || !router.isReady)
    return <LoadingHome text="Chargement de la page..." percentage={70} />
  if (error)
    return (
      <LoadingHome
        text={`Erreur ${error.name} : ${error.message}`}
        percentage={100}
        error
      />
    )
  if (!response)
    return <LoadingHome text="Chargement du personnage..." percentage={100} />
  const character = response.character
  const characterCell = response.cell
  return (
    <>
      <div>
        <Toaster />
      </div>
      <p className="title">{character.name}</p>
      <div className="buttons-list">
        <div className="section">
          <Map character={character} terrains={terrains} />
          <MapControls character={character} />
        </div>
      </div>
      <div className="buttons-list">
        <span>Énergie</span>
        <ProgressBar
          completed={String(character.stamina)}
          maxCompleted={10}
          transitionDuration="0.5s"
          transitionTimingFunction="ease-out"
          bgColor="#2b6eff"
          width="200px"
          margin="0 6px"
        />
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
