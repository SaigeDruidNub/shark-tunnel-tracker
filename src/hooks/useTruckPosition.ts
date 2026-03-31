import { useState, useEffect } from 'react';
import { routeLegs } from '../data/routeLegs';
import { getTruckPosition } from '../lib/truckInterpolation';
import type { TruckPosition } from '../lib/truckInterpolation';

const POLL_INTERVAL_MS = 60_000;

/**
 * Returns the truck's current position, re-computed once per minute.
 * Reads route schedule from the static `routeLegs` data file — no network calls.
 */
export function useTruckPosition(): TruckPosition {
  const [position, setPosition] = useState<TruckPosition>(() =>
    getTruckPosition(routeLegs, new Date()),
  );

  useEffect(() => {
    // Refresh immediately if routeLegs changed (dev HMR), then on interval
    setPosition(getTruckPosition(routeLegs, new Date()));

    const id = setInterval(() => {
      setPosition(getTruckPosition(routeLegs, new Date()));
    }, POLL_INTERVAL_MS);

    return () => clearInterval(id);
  }, []);

  return position;
}
