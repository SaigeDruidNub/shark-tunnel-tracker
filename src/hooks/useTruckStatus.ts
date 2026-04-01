import { useQuery } from "@tanstack/react-query";
import { readClient } from "../lib/sanity/client";
import { TRUCK_STATUS_QUERY, type TruckStatus } from "../lib/sanity/queries";

/** Bypass CDN so status updates appear within seconds, not minutes. */
const liveClient = readClient.withConfig({ useCdn: false });

const REFETCH_INTERVAL_MS = 30_000;

/**
 * Polls Sanity every 30 seconds for the latest shark truck status message.
 * Returns null while loading or if no document exists yet.
 */
export function useTruckStatus(): TruckStatus | null {
  const { data } = useQuery<TruckStatus | null>({
    queryKey: ["truckStatus"],
    queryFn: () => liveClient.fetch<TruckStatus | null>(TRUCK_STATUS_QUERY),
    staleTime: REFETCH_INTERVAL_MS,
    refetchInterval: REFETCH_INTERVAL_MS,
  });

  return data ?? null;
}
