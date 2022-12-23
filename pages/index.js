import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"

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
          onSubmit={async (event) => {
            // Stop the form from submitting and refreshing the page.
            event.preventDefault()
            toast.promise(createUser(event.target.name.value), {
              loading: "Création du compte",
              success: (data) => {
                mutate("/api/users")
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
                mutate("/api/users")
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
                mutate("/api/users")
                return "Base de données remplie"
              },
              error: "Une erreur est survenue",
            })
          }}
        >
          2. Remplir la base avec les valeurs par défaut
        </button>
        <br />
        <button
          onClick={async () => {
            toast.promise(query("/api/map", "POST"), {
              loading: "Création d'un monde",
              success: (data) => `${data.message}`,
              error: "Une erreur est survenue",
            })
          }}
        >
          Créer une carte
        </button>
        <button
          onClick={async () => {
            const body = {
              type: 1,
            }
            toast.promise(query("/api/map", "POST", body), {
              loading: "Création d'un monde",
              success: (data) => `${data.message}`,
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

function UserList() {
  const { data: users, error } = useSWR("/api/users", fetcher)
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
