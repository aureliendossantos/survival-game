import * as React from "react"
import { useState } from "react"
import Modal from "components/Modal"
import ProgressButton from "./ProgressButton/ProgressButton"
import query from "lib/query"
import { BookWithAllInfo } from "lib/api/types"
import toast from "react-hot-toast"
import { useSWRConfig } from "swr"
import useCharacterId from "lib/queries/useCharacterId"
import Icon from "./Windows/Icon"

async function learn(characterId: string, foodInstanceId: string) {
  const body = { id: foodInstanceId }
  return await query(`/api/characters/${characterId}/learn`, "PATCH", body)
}

type Props = {
  book: BookWithAllInfo
}

export default function RenderBook({ book }: Props) {
  const [open, setOpen] = useState(null)
  const [close, setClose] = useState(null)

  const { mutate } = useSWRConfig()
  const characterId = useCharacterId()
  return (
    <>
      <button
        onClick={open}
        className="rounded bg-bg-950 p-[0.6em] ring-2 ring-amber-400/70 transition-colors hover:bg-[#4d423f]"
      >
        <div className="relative -mb-[0.3em] -mt-[0.1em] inline-block h-[1.4em] w-[1.4em]">
          <div className="spritesheet bg-[-0%_-500%] invert" />
        </div>
        <span className="font-normal">{book.title}</span>
      </button>
      <Modal setOpen={setOpen} setClose={setClose}>
        <>
          <h2 className="mb-2">{book.title}</h2>
          <p>{book.description}</p>
          <h3 className="text-xs">Contenu</h3>
          <div className="mb-3 mt-1 flex flex-col gap-3 rounded bg-bg-900 p-3 text-sm">
            {book.structures.map((structure) => (
              <div className="flex" key={structure.id}>
                <Icon id={structure.id} size="1lh" />
                {structure.title}
              </div>
            ))}
            {book.actions.map((action) => (
              <div className="flex gap-1" key={action.id}>
                <Icon id={action.id} size="1lh" />
                {action.title}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <ProgressButton
              label="Apprendre"
              task={async () => {
                const response = await learn(characterId, book.id)
                response.success
                  ? toast.success(response.message)
                  : toast.error(response.message)
                mutate("/api/characters/" + characterId)
                close()
              }}
            />
          </div>
        </>
      </Modal>
    </>
  )
}
