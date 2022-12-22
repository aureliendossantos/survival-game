import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import ReactiveButton from "reactive-button"

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
  const [btn1State, setBtn1State] = useState("idle")
  const [btn2State, setBtn2State] = useState("idle")
  const [btn3State, setBtn3State] = useState("idle")
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

      <ReactiveButton
        color="dark"
        buttonState={btn1State}
        idleText="1. Vider la base de données"
        loadingText="Chargement"
        successText="Terminé"
        onClick={async () => {
          setBtn1State("loading")
          setMessage(await query("/api/setup", "DELETE"))
          setBtn1State("success")
          mutate("/api/users")
        }}
      />
      <br />
      <ReactiveButton
        color="dark"
        buttonState={btn2State}
        idleText="2. Remplir la base avec les valeurs par défaut"
        loadingText="Chargement"
        successText="Terminé"
        onClick={async () => {
          setBtn2State("loading")
          setMessage(await query("/api/setup", "POST"))
          setBtn2State("success")
          mutate("/api/users")
        }}
      />
      <br />
      <ReactiveButton
        color="dark"
        buttonState={btn3State}
        idleText="3. Créer une carte"
        loadingText="Chargement"
        successText="Terminé"
        onClick={async () => {
          setBtn3State("loading")
          setMessage(await query("/api/map", "POST"))
          setBtn3State("success")
          mutate("/api/users")
        }}
      />
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
