import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"

import useSWR, { useSWRConfig } from "swr"
import query from "lib/query"

const fetcher = (url) => fetch(url).then((res) => res.json())

async function createUser(name) {
  const body = {
    name: name,
  }
  return await query("/api/users", "POST", body)
}

const usersPath = "/api/users"

export default function LoginPage() {
  const { mutate } = useSWRConfig()
  return (
    <>
      <div>
        <Toaster />
      </div>
      <h1>Choisissez un compte</h1>
      <UserList />
      <div className="section">
        <h3>Créer un compte</h3>
        <form
          onSubmit={async (event: React.SyntheticEvent) => {
            // Stop the form from submitting and refreshing the page.
            event.preventDefault()
            const target = event.target as typeof event.target & {
              name: { value: string }
            }
            const name = target.name.value
            toast.promise(createUser(name), {
              loading: "Création du compte",
              success: (data) => {
                mutate(usersPath)
                return `${data.message}`
              },
              error: "Une erreur est survenue",
            })
          }}
        >
          <div className="buttons-list">
            <label htmlFor="name">Nom</label>
            <input type="text" id="name" name="name" required />
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
        <h4>Fonctions de debug</h4>
        <p>Utiliser en cas de problème.</p>
        <button
          onClick={async () => {
            toast.promise(query("/api/setup", "DELETE"), {
              loading: "Vidage de la base de données",
              success: () => {
                mutate(usersPath)
                return "Base de données vidée"
              },
              error: "Une erreur est survenue",
            })
          }}
        >
          1. Vider la base de données
        </button>
        <br />
        <button
          onClick={async () => {
            toast.promise(query("/api/setup", "POST"), {
              loading: "Remplissage de la base de données",
              success: () => {
                mutate(usersPath)
                return "Base de données remplie"
              },
              error: "Une erreur est survenue",
            })
          }}
        >
          2. Remplir la base avec les valeurs par défaut
        </button>
      </div>
    </>
  )
}

function UserList() {
  const { data: users, error } = useSWR("/api/users", fetcher, {
    refreshInterval: 5000,
  })
  if (error) return <p>Erreur de chargement.</p>
  if (!users) return <p>Chargement...</p>
  return (
    <ul className="user-list">
      {users.map((user) => (
        <Link href={"/user/" + user.id} key={user.id}>
          <li>{user.name}</li>
        </Link>
      ))}
    </ul>
  )
}
