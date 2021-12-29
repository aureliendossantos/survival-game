import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function LoginPage() {
  return <>
    <h1>Choisissez un compte</h1>
    <UserList />
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
