import Head from "next/head"
import Image from "next/image"
import ReactTooltip from "react-tooltip"
import toast, { Toaster } from "react-hot-toast"
import ProgressButton from "/components/ProgressButton"
import Card from "/components/Card"

import { GiPerson } from "react-icons/gi"
import { FaCampground } from "react-icons/fa"
import {
  ImArrowDown2,
  ImArrowLeft2,
  ImArrowRight2,
  ImArrowUp2,
} from "react-icons/im"

import prisma from "/lib/prisma"

import { useRouter } from "next/router"
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

export async function getStaticProps() {
  const terrains = await prisma.terrain.findMany({
    include: { actions: true },
  })
  const structures = await prisma.structure.findMany({
    include: {
      requiredItems: {
        include: { item: true },
      },
    },
  })
  return { props: { terrains, structures } }
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
    fallback: true,
  }
}

async function giveItem(characterId, itemId, quantity) {
  const body = {
    id: itemId,
    quantity: quantity,
  }
  return await query(
    "/api/characters/" + characterId + "/inventory",
    "PATCH",
    body
  )
}

async function doAction(characterId, actionId) {
  const body = {
    id: actionId,
  }
  return await query(
    "/api/characters/" + characterId + "/action",
    "PATCH",
    body
  )
}

async function build(characterId, structureId) {
  const body = {
    id: structureId,
  }
  return await query("/api/characters/" + characterId + "/build", "PATCH", body)
}

async function moveCharacter(id, x, y) {
  const body = {
    x: x,
    y: y,
  }
  return await query("/api/characters/" + id + "/move", "PATCH", body)
}

export default function Home({ terrains, structures }) {
  const router = useRouter()
  const { data: character, error } = useSWR(
    "/api/characters/" + router.query.id,
    fetcher
  )
  if (router.isFallback)
    return (
      <div className="loading">
        <progress id="loading" max="10" value="3"></progress>
        <label htmlFor="loading">
          <p>Chargement de la page...</p>
        </label>
      </div>
    )
  if (error) return <p>Erreur de chargement.</p>
  if (!character)
    return (
      <div className="loading">
        <progress id="loading" max="10" value="7"></progress>
        <label htmlFor="loading">
          <p>Chargement du personnage...</p>
        </label>
      </div>
    )
  return (
    <>
      <div>
        <Toaster />
      </div>
      <p className="title">{character.name}</p>
      <label htmlFor="energy">Énergie</label>
      <progress id="energy" max="10" value="10"></progress>
      <div className="buttons-list">
        <div className="section">
          <Map character={character} terrains={terrains} />
          <MapControls character={character} />
        </div>
        <div className="section">
          <LocationInfo character={character} />
        </div>
      </div>
      <div className="section">
        <h3>Actions</h3>{" "}
        <div className="buttons-list">
          <Actions character={character} />
          <Build character={character} structures={structures} />
        </div>
      </div>
      <div className="section">
        <h3>Inventaire</h3>
        <div className="buttons-list">
          <Inventory character={character} />
        </div>
      </div>
    </>
  )
}

function Build({ character, structures }) {
  const { mutate } = useSWRConfig()
  return structures ? (
    <>
      {structures.map((structure) => (
        <li key={structure.id}>
          <a data-tip data-for={structure.title}>
            <ProgressButton
              label={"Construire un " + structure.title}
              task={async () => {
                const response = await build(character.id, structure.id)
                response.success
                  ? toast.success(response.message)
                  : toast.error(response.message)
                mutate("/api/characters/" + character.id)
                mutate("/api/characters/" + character.id + "/cell")
              }}
            />
          </a>
        </li>
      ))}
      {structures.map((structure) => (
        <ReactTooltip id={structure.title} place="right" key={structure.id}>
          <p className="title">{structure.title}</p>
          {structure.description ? (
            <p className="description">{structure.description}</p>
          ) : null}
          <p>
            Solidité : {structure.minDurability}–{structure.maxDurability}
          </p>
          <strong>Ressources requises</strong>
          {structure.requiredItems.map((requirement) => (
            <li key={requirement.item.id}>
              <strong>{requirement.quantity}</strong> {requirement.item.title}
            </li>
          ))}
        </ReactTooltip>
      ))}
    </>
  ) : null
}

function Inventory({ character }) {
  const { mutate } = useSWRConfig()
  return (
    <>
      {character.inventory.map((entry) => (
        <li key={entry.item.id} className="item">
          <a data-tip data-for={entry.item.title}>
            <strong>{entry.quantity}</strong> {entry.item.title}
          </a>
          <ReactTooltip id={entry.item.title} place="right">
            <p className="title">{entry.item.title}</p>
            {entry.item.description ? (
              <p className="description">{entry.item.description}</p>
            ) : null}
          </ReactTooltip>
        </li>
      ))}
    </>
  )
}

function Actions({ character }) {
  const { mutate } = useSWRConfig()
  const { data: cell } = useSWR(
    "/api/characters/" + character.id + "/cell",
    fetcher
  )
  return cell ? (
    <>
      {cell.terrain.actions.map((action) => (
        <li key={action.id}>
          <a data-tip data-for={action.title}>
            <ProgressButton
              label={action.title}
              task={async () => {
                const response = await doAction(character.id, action.id)
                response.success
                  ? toast.success(response.message)
                  : toast.error(response.message)
                mutate("/api/characters/" + character.id)
              }}
            />
          </a>
          <ReactTooltip id={action.title} place="right">
            <p className="title">{action.title}</p>
            {action.description ? (
              <p className="description">{action.description}</p>
            ) : null}
          </ReactTooltip>
        </li>
      ))}
    </>
  ) : null
}

function LocationInfo({ character }) {
  const { data: cell, error } = useSWR(
    "/api/characters/" + character.id + "/cell",
    fetcher
  )
  if (error) return <p>Erreur de chargement</p>
  if (!cell) return <p>Chargement...</p>
  return (
    <div className="location">
      <h4>À votre emplacement :</h4>
      <Card
        iconColor={"tile " + cell.terrain.id}
        title={cell.terrain.title}
        position={"x:" + cell.x + " y:" + cell.y}
        description={cell.terrain.description}
      />
      {cell.builtStructures
        ? cell.builtStructures.map((structure) => (
            <div className="structure" key={structure.id}>
              <Card
                icon={"camp"}
                iconColor={"tile structure-icon"}
                title={structure.structure.title}
                description={structure.structure.description}
                author={structure.contributors.map(
                  (character) => "🧑‍🦰 " + character.name
                )}
                contents={[
                  "Solidité : " +
                    structure.durability +
                    "/" +
                    structure.structure.maxDurability,
                  "Construit : " +
                    new Date(structure.lastDurabilitySet).toLocaleDateString(
                      "fr-fr",
                      {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      }
                    ),
                ]}
              />
            </div>
          ))
        : null}
    </div>
  )
}

function Map({ character, terrains }) {
  const cells = character.map.cells
  const width = Math.max(...cells.map((cell) => cell.y)) + 1
  const height = Math.max(...cells.map((cell) => cell.x)) + 1
  return (
    <>
      <h3>Carte</h3>
      <table>
        <tbody>
          {[...Array(width).keys()].map((y) => (
            <tr key={y}>
              {[...Array(height).keys()].map((x) => {
                const cell = cells.find((cell) => cell.x == x && cell.y == y)
                return (
                  <>
                    <a
                      data-tip={cell.terrainId}
                      data-for="location"
                      style={{ display: "contents" }}
                    >
                      <td key={cell.id} className={cell.terrainId}>
                        {character.x == cell.x && character.y == cell.y ? (
                          <GiPerson />
                        ) : null}
                        {cell.builtStructures.length > 0 ? (
                          <div className="structure-marker">
                            <FaCampground />
                          </div>
                        ) : null}
                      </td>
                    </a>
                  </>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {terrains ? (
        <ReactTooltip
          id="location"
          place="right"
          getContent={(dataTip) => {
            const terrain = terrains.find((terrain) => terrain.id == dataTip)
            if (terrain) {
              return (
                <>
                  <p className="title">{terrain.title}</p>
                  <p className="description">{terrain.description}</p>
                </>
              )
            }
          }}
        />
      ) : null}
    </>
  )
}

function MapControls({ character }) {
  const { mutate } = useSWRConfig()
  const map = character.map.cells
  const directions = [
    [-1, 0, <ImArrowLeft2 key={0} />],
    [0, -1, <ImArrowUp2 key={1} />],
    [0, 1, <ImArrowDown2 key={2} />],
    [1, 0, <ImArrowRight2 key={3} />],
  ]
  return (
    <div style={{ textAlign: "center" }}>
      {directions.map((dir, index) => {
        const targetCell = map.find(
          (cell) =>
            cell.x == character.x + dir[0] && cell.y == character.y + dir[1]
        )
        const disabled = !targetCell || targetCell.terrainId == "sea"
        return (
          <ProgressButton
            key={index}
            label={dir[2]}
            disabled={disabled}
            icon={true}
            task={async () => {
              if (!disabled) {
                await moveCharacter(character.id, dir[0], dir[1])
                mutate("/api/characters/" + character.id)
                mutate("/api/characters/" + character.id + "/cell")
              }
            }}
          />
        )
      })}
    </div>
  )
}
