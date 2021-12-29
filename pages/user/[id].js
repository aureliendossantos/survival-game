import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function UserHome() {
  return <>
    <h1>Personnages</h1>
    <CharacterList />
  </>
}

function CharacterList() {
  const router = useRouter()
  const { data: user, error } = useSWR('/api/users/' + router.query.id, fetcher)
  if (error) return <p>Erreur de chargement.</p>
  if (!user) return <p>Chargement...</p>
  return <ul className='user-list'>
    {user.characters.map(character => (
      <Link href={'/character/' + character.id} key={character.id}>
        <a><li>
          🧑‍🦰 {character.name}
        </li></a>
      </Link>
    ))}
  </ul>
}
