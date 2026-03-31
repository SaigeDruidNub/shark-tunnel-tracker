import { useState, useEffect } from 'react';
import { routeLegs } from '../data/routeLegs';
import { getTruckPosition } from '../lib/truckInterpolation';
import type { TruckPosition } from '../lib/truckInterpolation';

const POLL_INTERVAL_MS = 60_000;

/**
 * Returns the truck's current position, re-computed once per minute.
 * Reads route schedule from the static `routeLegs` data file — no network calls.
 *
 * @param nowOverride - Optional date to use instead of the real current time.
 *   Pass `state.debugNow` from AppContext to enable the dev time scrubber.
 */
export function useTruckPosition(nowOverride?: Date): TruckPosition {
  const [position, setPosition] = useState<TruckPosition>(() =>
    getTruckPosition(routeLegs, nowOverride ?? new Date()),
  );

  useEffect(() => {
    // When a debug override is set, compute once and stop the interval
    if (nowOverride !== undefined) {
      setPosition(getTruckPosition(routeLegs, nowOverride));
      return;
    }

    // Normal mode: refresh immediately then poll every minute
    setPosition(getTruckPosition(routeLegs, new Date()));
    const id = setInterval(() => {
      setPosition(getTruckPosition(routeLegs, new Date()));
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [nowOverride]);

  return position;
}
