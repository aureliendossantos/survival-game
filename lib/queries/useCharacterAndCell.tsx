import { CellWithAllInfo, CharacterWithAllInfo } from "lib/api/types"
import { fetcher } from "lib/fetcher"
import { useRouter } from "next/router"
import useSWR from "swr"

/**
 * Use the ID in the current URL to return the correct character and its cell.
 */
export default function useCharacterAndCell() {
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR<
    {
      character: CharacterWithAllInfo
      cell: CellWithAllInfo
      message?: string
    },
    Error
  >(id ? `/api/characters/${String(id)}` : null, fetcher, {
    refreshInterval: 5000,
  })

  return {
    character: data ? data.character : null,
    cell: data ? data.cell : null,
    message: data ? data.message : null,
    error,
  }
}
