import * as React from "react"
import { useState } from "react"
import Modal from "components/Modal"
import ProgressButton from "./ProgressButton/ProgressButton"
import query from "lib/query"
import { Food } from "@prisma/client"
import { FoodInstanceWithAllInfo } from "lib/api/types"
import toast from "react-hot-toast"
import { useSWRConfig } from "swr"
import useCharacterId from "lib/queries/useCharacterId"
import ProgressBar from "@ramonak/react-progress-bar"

async function eat(characterId: string, foodInstanceId: string) {
  const body = { id: foodInstanceId }
  return await query("/api/characters/" + characterId + "/eat", "PATCH", body)
}

type Props = {
  instance: FoodInstanceWithAllInfo
}

export default function RenderFoodInstance({ instance }: Props) {
  const [open, setOpen] = useState(null)
  const [close, setClose] = useState(null)

  const { mutate } = useSWRConfig()
  const characterId = useCharacterId()
  return (
    <>
      <button
        onClick={open}
        className="bg-bg-950 rounded p-[0.6em] transition-colors hover:bg-[#4d423f]"
      >
        <div className="relative -mb-[0.3em] -mt-[0.1em] inline-block h-[1.4em] w-[1.4em]">
          <div
            className={`spritesheet ${getIconSprite(instance.food)}`}
            style={{ filter: "invert(100%)" }}
          />
        </div>
        <span className="font-medium">
          {Math.round((instance.durability / instance.food.durability) * 100)}%
        </span>
      </button>
      <Modal setOpen={setOpen} setClose={setClose}>
        <>
          <h2 className="mb-2">{instance.food.title}</h2>
          <p>{instance.food.description}</p>
          <div className="flex justify-between">
            <span>Conservation</span>
            <span className="font-semibold">
              {Math.round(
                (instance.durability / instance.food.durability) * 100,
              )}
              %
            </span>
          </div>
          <ProgressBar
            completed={String(instance.durability)}
            maxCompleted={instance.food.durability}
            bgColor="#f5c57d"
            height="5px"
            margin="0"
            padding="0"
            borderRadius="2px"
            baseBgColor="#9599a3"
            isLabelVisible={false}
            transitionDuration="0.5s"
            transitionTimingFunction="ease-out"
          />
          <p className="my-3">
            Restaure {instance.food.satiety} point
            {instance.food.satiety > 1 && "s"} de faim.
          </p>
          <div className="flex justify-center">
            <ProgressButton
              label="Manger"
              task={async () => {
                const response = await eat(characterId, instance.id)
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

function getIconSprite(food: Food) {
  switch (food.id) {
    case "fish":
      return "bg-[-700%_-400%]"
    default:
      return "bg-[-0%_-0%]"
  }
}
