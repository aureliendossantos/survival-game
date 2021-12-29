import Head from 'next/head'
import Image from 'next/image'
import ReactTooltip from 'react-tooltip'

import { useRouter } from 'next/router'
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

async function giveItem(characterId, itemId, quantity) {
  const body = {
    id: itemId,
    quantity: quantity
  }
  return await query('/api/characters/' + characterId + '/inventory', 'PATCH', body)
}

async function doAction(characterId, actionId) {
  const body = {
    id: actionId
  }
  return await query('/api/characters/' + characterId + '/action', 'PATCH', body)
}

async function build(characterId, structureId) {
  const body = {
    id: structureId
  }
  return await query('/api/characters/' + characterId + '/build', 'PATCH', body)
}

async function moveCharacter(id, x, y) {
  const body = {
    x: x,
    y: y
  }
  return await query('/api/characters/' + id + '/move', 'PATCH', body)
}

export default function Home() {
  const router = useRouter()
  const { data: character, error } = useSWR('/api/characters/' + router.query.id, fetcher)
  if (error) return <p>Erreur de chargement</p>
  if (!character) return <p>Chargement...</p>
  return <>
    <p className='title'>{character.name}</p>
    <LocationInfo character={character} />
    <Map character={character} />
    <MapControls character={character} />
    <Actions character={character} />
    <Build character={character} />
    <Inventory character={character} />
  </>
}

function Build({ character }) {
  const { mutate } = useSWRConfig()
  const { data: structures } = useSWR('/api/structures', fetcher)
  return structures ? <>
    <h3>Construire</h3>
    {structures.map(structure => (
      <li key={structure.id}>
        <a data-tip data-for={structure.title}>
          <button
            onClick={async () => {
              await build(character.id, structure.id)
              mutate('/api/characters/' + character.id)
              mutate('/api/characters/' + character.id + '/cell')
          }}>
            {structure.title}
          </button>
        </a>
        <ReactTooltip id={structure.title} place='right'>
          <p className='title'>{structure.title}</p>
          {structure.description ? <p className='description'>{structure.description}</p> : null}
          <p>Solidité : {structure.minDurability}–{structure.maxDurability}</p>
          {structure.requiredItems.map(requirement => (
            <li key={requirement.item.id}>
              <strong>{requirement.quantity}</strong> {requirement.item.name}
            </li>
          ))}
        </ReactTooltip>
      </li>
    ))}
  </> : null
}

function Inventory({ character }) {
  const { mutate } = useSWRConfig()
  return <>
    <h3>Inventaire</h3>
    {character.inventory.map(entry => (
      <li key={entry.item.id}>
        <a data-tip data-for={entry.item.name}>{entry.item.name}</a>: {entry.quantity}
        <ReactTooltip id={entry.item.name} place='right'>
          <p className='title'>{entry.item.name}</p>
          {entry.item.description ? <p className='description'>{entry.item.description}</p> : null}
        </ReactTooltip>
        <button
          onClick={async () => {
            await giveItem(character.id, entry.item.id, 1)
            mutate('/api/characters/' + character.id)
          }}>
          Give
        </button>
      </li>
    ))}
  </>
}

function Actions({ character }) {
  const [message, setMessage] = useState()
  const { mutate } = useSWRConfig()
  const { data: cell } = useSWR('/api/characters/' + character.id + '/cell', fetcher)
  return cell ? <>
    <h3>Actions</h3>
    {message ? <p className={message.success ? 'success' : 'failure'}>{message.message}</p> : null}
    {cell.terrain.actions.map(action => (
      <li key={action.id}>
        <a data-tip data-for={action.title}>
          <button
            onClick={async () => {
              setMessage(await doAction(character.id, action.id))
              mutate('/api/characters/' + character.id)
          }}>
            {action.title}
          </button>
        </a>
        <ReactTooltip id={action.title} place='right'>
          <p className='title'>{action.title}</p>
          {action.description ? <p className='description'>{action.description}</p> : null}
        </ReactTooltip>
      </li>
    ))}
  </> : null
}

function LocationInfo({ character }) {
  const { data: cell, error } = useSWR('/api/characters/' + character.id + '/cell', fetcher)
  if (error) return <p>Erreur de chargement</p>
  if (!cell) return <p>Chargement...</p>
  return <div className='location'>
    <div className='terrain'>
      <div className={'tile ' + cell.terrain.type}></div>
      <div className='text'>
        <p className='title'>{cell.terrain.name} <span className='position'>x:{cell.x} y:{cell.y}</span></p>
        {cell.terrain.description ? <p className='description'>{cell.terrain.description}</p> : null}
      </div>
    </div>
    {cell.builtStructures ? cell.builtStructures.map(structure => (
      <div className='structure' key={builtStructure.id}>
        <div className={'tile'}></div>
        <div className='text'>
          <p className='title'>{structure.structure.title}</p>
          {structure.structure.description ? <p className='description'>{structure.structure.description}</p> : null}
          <p className='author'>🧑‍🦰 {structure.builtBy.name}</p>
          <p>Solidité : {structure.durability}/{structure.structure.maxDurability}<br/>({Date(structure.lastDurabilitySet)})</p>
        </div>
      </div>
    )) : null}
  </div>
}

function Map({ character }) {
  const map = character.map.cells
  const { data: terrains } = useSWR('/api/terrains', fetcher)
  return <>
    <h3>Carte</h3>
    <table><tbody>
      {[0,1,2].map(y => ( // utiliser prisma ou js pour compter le nb de valeurs différentes de y
        <tr key={y}>
          {map.filter(cell => cell.y == y).map(cell => <>
            <a data-tip={cell.type} data-for='location' style={{display: 'contents'}}>
              <td key={cell.id} className={cell.type}>
                {character.x == cell.x && character.y == cell.y ? "★" : null}
                {cell.builtStructures.length > 0 ? <div className='structure-marker'>△</div> : null}
              </td>
            </a>
          </>)}
        </tr>
      ))}
    </tbody></table>
    {terrains ?
      <ReactTooltip id='location' place='right' getContent={(dataTip) => {
        const terrain = terrains.find(terrain => terrain.type == dataTip)
        if (terrain) {
          return <>
            <p className='title'>{terrain.name}</p>
            <p className='description'>{terrain.description}</p>
          </>
        }
      }}/>
    : null}
  </>
}

function MapControls({ character }) {
  const { mutate } = useSWRConfig()
  const map = character.map.cells
  const directions = [
    [-1, 0, "<"],
    [0, -1, "^"],
    [0, 1, "v"],
    [1, 0, ">"]
  ]
  return <>
    {directions.map(dir => {
      const targetCell = map.find(cell => cell.x == character.x + dir[0] && cell.y == character.y + dir[1])
      return !targetCell || targetCell.type == "sea" ? 
        <button>x</button>
      : <button onClick={async () => {
          await moveCharacter(character.id, dir[0], dir[1])
          mutate('/api/characters/' + character.id)
          mutate('/api/characters/' + character.id + '/cell')
        }}>
          {dir[2]}
        </button>
    })}
  </>
}
