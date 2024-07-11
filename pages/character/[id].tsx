import Layout from "components/Layout"
import LoadingScreen from "components/LoadingScreen"
import GameScreen from "components/GameScreen"
import { Toaster } from "react-hot-toast"
import useCharacterAndCell from "lib/queries/useCharacterAndCell"

/**
 * Fetches character and game data, handles errors then returns the game screen.
 */
export default function Home() {
  const { character, message, error } = useCharacterAndCell()
  if (error)
    return (
      <LoadingScreen
        text={`Erreur ${error.name} : ${error.message}`}
        percentage={100}
        error
      />
    )
  if (message)
    return <LoadingScreen text={`Erreur : ${message}`} percentage={100} error />
  if (!character)
    return <LoadingScreen text="Chargement du personnage..." percentage={100} />
  return (
    <Layout>
      <div>
        <Toaster
          toastOptions={{
            duration: 6000,
            error: { duration: 8000, style: { background: "#edd1d1" } },
          }}
        />
      </div>
      <GameScreen />
    </Layout>
  )
}
