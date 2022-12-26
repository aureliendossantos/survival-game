import { Item } from "@prisma/client"

type ItemProps = {
  item: Item
  quantity?: number
}

export default function RenderItem({ item, quantity }: ItemProps) {
  return (
    <>
      {quantity && (
        <>
          <strong>{quantity}</strong>{" "}
        </>
      )}
      {item.title}
      {quantity > 1 && (item.pluralTitle || "s")}
    </>
  )
}
