import { useQuery } from "@tanstack/react-query";
import { readClient } from "../lib/sanity/client";
import { STOP_RECAP_QUERY, type StopRecap } from "../lib/sanity/queries";

export function useStopRecap(stopId: string | null) {
  const docId = stopId ? `stopRecap-${stopId}` : null;

  return useQuery<StopRecap | null>({
    queryKey: ["stopRecap", docId],
    queryFn: () =>
      readClient.fetch<StopRecap | null>(STOP_RECAP_QUERY, { docId }),
    enabled: !!docId,
    staleTime: 60_000,
  });
}
