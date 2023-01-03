import { StructureWithAllInfo } from "lib/api/types"
import { fetcher } from "lib/fetcher"
import useSWRImmutable from "swr/immutable"

export default function useStructure(id: string) {
  const { data, error } = useSWRImmutable<StructureWithAllInfo, Error>(
    `/api/structures/${id}`,
    fetcher
  )
  return {
    structure: data,
    structureError: error,
  }
}
