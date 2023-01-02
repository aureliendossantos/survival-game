import { GetStaticProps, GetStaticPaths } from "next"
import prisma from "lib/prisma"
import { useRouter } from "next/router"
import useSWR from "swr"
import {
  CellWithAllInfo,
  CharacterWithAllInfo,
  StructureWithAllInfo,
  TerrainWithActions,
} from "lib/api/types"
import LoadingScreen from "components/LoadingScreen"
import GameScreen from "components/GameScreen"
import { Toaster } from "react-hot-toast"

const fetcher = (url) => fetch(url).then((res) => res.json())

export const getStaticProps: GetStaticProps = async () => {
  const terrains = await prisma.terrain.findMany({
    include: { actions: true },
  })
  const structures = await prisma.structure.findMany({
    include: {
      requiredMaterials: {
        include: { material: true },
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

/**
 * Fetches character and game data, handles errors then returns the game screen.
 * @param param0
 * @returns
 */
export default function Home({ terrains, structures }: Props) {
  const router = useRouter()
  const { id } = router.query
  const { data: response, error } = useSWR<
    {
      character: CharacterWithAllInfo
      cell: CellWithAllInfo
      message?: string
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
  if (response && response.message)
    return (
      <LoadingScreen
        text={`Erreur : ${response.message}`}
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
      <GameScreen
        terrains={terrains}
        structures={structures}
        character={character}
        cell={characterCell}
      />
    </>
  )
}
