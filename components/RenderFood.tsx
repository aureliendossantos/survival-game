import * as React from "react"
import { Modal } from "@mui/base/Modal"
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
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { mutate } = useSWRConfig()
  const characterId = useCharacterId()
  return (
    <>
      <button
        onClick={handleOpen}
        className="rounded bg-[#1c1817] p-[0.6em] transition-colors hover:bg-[#4d423f]"
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
      <Modal
        open={open}
        onClose={handleClose}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <>
          <div
            onClick={handleClose}
            className="fixed inset-0 -z-10 bg-black/50"
          />
          <div className="flex max-w-sm flex-col rounded-md border-b-4 border-[#2f2927] bg-[#4d423f] p-3">
            <h2 className="mb-2">{instance.food.title}</h2>
            <p>{instance.food.description}</p>
            <div className="flex justify-between">
              <span>Conservation</span>
              <span className="font-semibold">
                {(instance.durability / instance.food.durability) * 100}%
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
                  handleClose()
                }}
              />
            </div>
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
