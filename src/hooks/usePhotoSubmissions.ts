import { useQuery } from '@tanstack/react-query'
import { readClient } from '../lib/sanity/client'
import { APPROVED_SUBMISSIONS_QUERY } from '../lib/sanity/queries'
import type { PhotoSubmission } from '../types/photoSubmission'

const REFETCH_INTERVAL_MS = 60_000

export function usePhotoSubmissions() {
  return useQuery<PhotoSubmission[]>({
    queryKey: ['photoSubmissions'],
    queryFn: () => readClient.fetch<PhotoSubmission[]>(APPROVED_SUBMISSIONS_QUERY),
    refetchInterval: REFETCH_INTERVAL_MS,
    staleTime: REFETCH_INTERVAL_MS,
  })
}
