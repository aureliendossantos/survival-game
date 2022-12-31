import query from "lib/query"

export default async function giveItem(
  characterId: string,
  itemId: number,
  quantity: number
) {
  const body = {
    id: itemId,
    quantity: quantity,
  }
  return await query(`/api/characters/${characterId}/inventory`, "PATCH", body)
}
