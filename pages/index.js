import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

async function query(url, method, body) {
  return await fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(function(response) {
    return response.json()
  })
}

export default function LoginPage() {
  const [message, setMessage] = useState()
  const { mutate } = useSWRConfig()
  return <>
    <h1>Choisissez un compte</h1>
    <UserList />
    <h3>Fonctions de test</h3>
    {message ? <p className={message.success ? 'success' : 'failure'}>{message.message}</p> : null}
    <button onClick={async () => {
      setMessage(await query('/api/setup', 'DELETE'))
      mutate('/api/users')
    }}>Vider la base de données</button>
    <button onClick={async () => {
      setMessage(await query('/api/setup', 'POST'))
      mutate('/api/users')
    }}>Remplir la base avec les valeurs par défaut</button>
  </>
}

function UserList() {
  const { data: users, error } = useSWR('/api/users', fetcher)
  if (error) return <p>Erreur de chargement.</p>
  if (!users) return <p>Chargement...</p>
  return <ul className='user-list'>
    {users.map(user => (
      <Link href={'/user/' + user.id} key={user.id}>
        <a><li>
          {user.name}
        </li></a>
      </Link>
    ))}
  </ul>
}
