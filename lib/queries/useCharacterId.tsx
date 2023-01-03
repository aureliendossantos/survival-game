import { useRouter } from "next/router"

/**
 * Returns the character ID in the current URL.
 */
export default function useCharacterId() {
  const router = useRouter()
  const { id } = router.query
  return id ? String(id) : null
}
