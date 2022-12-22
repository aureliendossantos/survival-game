import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

import { useState } from "react"
import useSWR, { useSWRConfig } from "swr"

const fetcher = (url) => fetch(url).then((res) => res.json())

async function query(url, method, body) {
  return await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(function (response) {
    return response.json()
  })
}

async function createUser(name) {
  const body = {
    name: name,
  }
  return await query("/api/users", "POST", body)
}

export default function LoginPage() {
  const [message, setMessage] = useState()
  const { mutate } = useSWRConfig()
  return (
    <>
      <h1>Choisissez un compte</h1>
      <UserList />
      <h3>Créer un compte</h3>
      {message ? (
        <p className={message.success ? "success" : "failure"}>
          {message.message}
        </p>
      ) : null}
      <form
        onSubmit={async (event) => {
          // Stop the form from submitting and refreshing the page.
          event.preventDefault()
          setMessage(await createUser(event.target.name.value))
          mutate("/api/users")
        }}
      >
        <label htmlFor="name">Nom</label>
        <input type="text" id="name" name="name" required />
        <button type="submit">Créer</button>
      </form>
      <h3>Fonctions de debug</h3>
      <button
        onClick={async () => {
          setMessage(await query("/api/setup", "DELETE"))
          mutate("/api/users")
        }}
      >
        1. Vider la base de données
      </button>
      <button
        onClick={async () => {
          setMessage(await query("/api/setup", "POST"))
          mutate("/api/users")
        }}
      >
        2. Remplir la base avec les valeurs par défaut
      </button>
      <button
        onClick={async () => {
          setMessage(await query("/api/map", "POST"))
        }}
      >
        3. Créer une carte
      </button>
    </>
  )
}

function UserList() {
  const { data: users, error } = useSWR("/api/users", fetcher)
  if (error) return <p>Erreur de chargement.</p>
  if (!users) return <p>Chargement...</p>
  return (
    <ul className="user-list">
      {users.map((user) => (
        <Link href={"/user/" + user.id} key={user.id}>
          <a>
            <li>{user.name}</li>
          </a>
        </Link>
      ))}
    </ul>
  )
}
