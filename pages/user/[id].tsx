import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"

import { useRouter } from "next/router"
import React from "react"
import useSWR, { useSWRConfig } from "swr"
import query from "lib/query"
import { fetcher } from "lib/fetcher"
import ProgressButton from "components/ProgressButton/ProgressButton"
import Layout from "components/Layout"

async function createCharacter(name, userId, mapId) {
  const body = {
    name: name,
    userId: userId,
    mapId: mapId,
  }
  return await query("/api/characters", "POST", body)
}

export default function UserHome() {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  return (
    <Layout>
      <div>
        <Toaster />
      </div>
      <h1 className="mb-4 mt-8 text-xl">Personnages</h1>
      <CharacterList />
      <div className="mt-8 rounded bg-[#2b1f1c] p-4">
        <h3 className="mb-4 mt-2 text-xl">Créer un personnage</h3>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (event: React.SyntheticEvent) => {
            // Stop the form from submitting and refreshing the page.
            event.preventDefault()
            const target = event.target as typeof event.target & {
              name: { value: string }
              map: { value: string }
            }
            const name = target.name.value
            const map = target.map.value
            toast.promise(
              createCharacter(name, router.query.id, parseInt(map)),
              {
                loading: "Création du personnage",
                success: (data) => {
                  mutate("/api/users/" + router.query.id)
                  return `${data.message}`
                },
                error: "Une erreur est survenue",
              },
            )
          }}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Nom </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Entrez un nom..."
              required
              className="rounded-lg bg-[#4b5365] px-3 py-2 shadow-inner"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="map">Monde </label>
            <select
              name="map"
              id="map"
              className="rounded-lg bg-[#4b5365] px-3 py-2 shadow-inner"
            >
              <MapOptions />
            </select>
          </div>
          <ProgressButton label="Créer" task={async () => {}} />
        </form>
      </div>
      <div className="mt-4 flex flex-col gap-2 rounded bg-[#283148] p-4">
        <h4 className="mb-4 text-xl">Créer un monde</h4>
        <ProgressButton
          label="Créer un petit monde"
          task={async () => {
            toast.promise(query("/api/map", "POST"), {
              loading: "Création d'un monde",
              success: (data) => {
                mutate("/api/map")
                return `${data.message}`
              },
              error: "Une erreur est survenue",
            })
          }}
        />
        <ProgressButton
          label="Créer un grand monde"
          task={async () => {
            const body = {
              type: 1,
            }
            toast.promise(query("/api/map", "POST", body), {
              loading: "Création d'un monde",
              success: (data) => {
                mutate("/api/map")
                return `${data.message}`
              },
              error: "Une erreur est survenue",
            })
          }}
        />
      </div>
    </Layout>
  )
}

function CharacterList() {
  const router = useRouter()
  const { data: user, error } = useSWR("/api/users/" + router.query.id, fetcher)
  if (error) return <p>Erreur de chargement.</p>
  if (!user) return <p>Chargement...</p>
  return (
    <div className="flex max-w-[300px] flex-col">
      {user.characters.map((character) => (
        <Link
          href={"/character/" + character.id}
          key={character.id}
          className="bg-[#222c42] p-[1em] first:rounded-t-lg last:rounded-b-lg even:bg-[#2f3b55]"
        >
          🧑‍🦰 {character.name + " "}
          <span style={{ fontSize: "x-small", color: "lightblue" }}>
            Monde {character.mapId}
          </span>
        </Link>
      ))}
    </div>
  )
}

function MapOptions() {
  const { data: maps, error } = useSWR("/api/map", fetcher)
  if (error) return <option value="error">Erreur de chargement</option>
  if (!maps) return <option value="loading">Chargement...</option>
  return (
    <>
      {maps.map((map) => (
        <option value={map.id} key={map.id}>
          Monde {map.id}
        </option>
      ))}
    </>
  )
}
