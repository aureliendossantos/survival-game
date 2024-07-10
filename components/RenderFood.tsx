import { Food } from "@prisma/client"
import { FoodInstanceWithAllInfo } from "lib/api/types"

function getIconSprite(food: Food) {
  switch (food.id) {
    case "fish":
      return "bg-[-700%_-400%]"
    default:
      return "bg-[-0%_-0%]"
  }
}

type Props = {
  instance: FoodInstanceWithAllInfo
}

export default function RenderFoodInstance({ instance }: Props) {
  return (
    <span>
      <div className="relative -mb-[0.3em] -mt-[0.1em] inline-block h-[1.4em] w-[1.4em]">
        <div
          className={`spritesheet ${getIconSprite(instance.food)}`}
          style={{ filter: "invert(100%)" }}
        />
      </div>
      <span className="font-medium">
        {Math.round((instance.durability / instance.food.durability) * 100)}%
      </span>
    </span>
  )
}
