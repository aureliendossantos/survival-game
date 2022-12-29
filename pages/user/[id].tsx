import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"

import { useRouter } from "next/router"
import React from "react"
import useSWR, { useSWRConfig } from "swr"
import query from "lib/query"

const fetcher = (url) => fetch(url).then((res) => res.json())

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
    <>
      <div>
        <Toaster />
      </div>
      <h1>Personnages</h1>
      <CharacterList />
      <div className="section">
        <h3>Créer un personnage</h3>
        <form
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
              }
            )
          }}
        >
          <div className="buttons-list">
            <label htmlFor="name">Nom</label>
            <input type="text" id="name" name="name" required />
            <label htmlFor="map">Monde</label>
            <select name="map" id="map">
              <MapOptions />
            </select>
            <button type="submit">Créer</button>
          </div>
        </form>
      </div>
      <div
        style={{
          marginTop: "8em",
          padding: "1em",
          borderRadius: "6px",
          border: "2px solid grey",
          backgroundColor: "#283148",
        }}
      >
        <h4>Créer un monde</h4>
        <button
          onClick={async () => {
            toast.promise(query("/api/map", "POST"), {
              loading: "Création d'un monde",
              success: (data) => {
                mutate("/api/map")
                return `${data.message}`
              },
              error: "Une erreur est survenue",
            })
          }}
        >
          Créer une petite carte
        </button>
        <br />
        <button
          onClick={async () => {
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
        >
          Créer une grande carte
        </button>
      </div>
    </>
  )
}

function CharacterList() {
  const router = useRouter()
  const { data: user, error } = useSWR("/api/users/" + router.query.id, fetcher)
  if (error) return <p>Erreur de chargement.</p>
  if (!user) return <p>Chargement...</p>
  return (
    <ul className="user-list">
      {user.characters.map((character) => (
        <Link href={"/character/" + character.id} key={character.id}>
          <li>
            🧑‍🦰 {character.name + " "}
            <span style={{ fontSize: "x-small", color: "lightblue" }}>
              Monde {character.mapId}
            </span>
          </li>
        </Link>
      ))}
    </ul>
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
