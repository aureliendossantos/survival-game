import { StructureWithAllInfo } from "lib/api/types"
import { fetcher } from "lib/fetcher"
import useSWRImmutable from "swr/immutable"

export default function useStructures() {
  const { data, error } = useSWRImmutable<StructureWithAllInfo[], Error>(
    `/api/structures`,
    fetcher
  )
  return {
    structures: data,
    structuresError: error,
  }
}
