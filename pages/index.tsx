import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"

import useSWR, { useSWRConfig } from "swr"
import query from "lib/query"
import { fetcher } from "lib/fetcher"
import ProgressButton from "components/ProgressButton/ProgressButton"
import Layout from "components/Layout"

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
    <Layout>
      <div>
        <Toaster />
      </div>
      <h1 className="mb-4 mt-8 text-xl">Choisissez un compte</h1>
      <UserList />
      <div className="mt-8 rounded bg-bg-900 p-4">
        <h3 className="mb-4 mt-2 text-xl">Créer un compte</h3>
        <form
          className="flex flex-col gap-4"
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
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Nom :</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Entrez votre nom..."
              required
              className="rounded-lg bg-[#4b5365] px-3 py-2 shadow-inner"
            />
          </div>
          <ProgressButton label="Créer" task={async () => {}} />
        </form>
      </div>
      <div className="mt-40 flex flex-col gap-2 rounded border-2 border-gray-500 bg-[#283148] p-4">
        <h4>Fonctions de debug</h4>
        <p>Utiliser en cas de problème.</p>
        <ProgressButton
          label="1. Vider la base de données"
          task={async () => {
            toast.promise(query("/api/setup", "DELETE"), {
              loading: "Vidage de la base de données",
              success: () => {
                mutate(usersPath)
                return "Base de données vidée"
              },
              error: "Une erreur est survenue",
            })
          }}
        />
        <ProgressButton
          label="2. Remplir la base avec les valeurs par défaut"
          task={async () => {
            toast.promise(query("/api/setup", "POST"), {
              loading: "Remplissage de la base de données",
              success: () => {
                mutate(usersPath)
                return "Base de données remplie"
              },
              error: "Une erreur est survenue",
            })
          }}
        />
      </div>
    </Layout>
  )
}

function UserList() {
  const { data: users, error } = useSWR("/api/users", fetcher, {
    refreshInterval: 5000,
  })
  if (error) return <p>Erreur de chargement.</p>
  if (!users) return <p>Chargement...</p>
  return (
    <div className="flex max-w-[300px] flex-col">
      {users.map((user) => (
        <Link
          href={"/user/" + user.id}
          key={user.id}
          className="bg-[#222c42] p-[1em] first:rounded-t-lg last:rounded-b-lg even:bg-[#2f3b55]"
        >
          {user.name}
        </Link>
      ))}
    </div>
  )
}
