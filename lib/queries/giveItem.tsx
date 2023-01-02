import query from "lib/query"

export default async function giveMaterial(
  characterId: string,
  materialId: number,
  quantity: number
) {
  const body = {
    id: materialId,
    quantity: quantity,
  }
  return await query(`/api/characters/${characterId}/inventory`, "PATCH", body)
}
