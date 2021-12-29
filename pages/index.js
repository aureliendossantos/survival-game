import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

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
  const { mutate } = useSWRConfig()
  return <>
    <h1>Choisissez un compte</h1>
    <UserList />
    <h3>Fonctions de test</h3>
    <button onClick={async () => {
      await query('/api/setup', 'POST', {})
      mutate('/api/users')
    }}>Réinitialiser la base de données</button>{"(Cliquer sur le bouton jusqu'à ce qu'il fonctionne : ordre de suppression imprévisible)"}
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
