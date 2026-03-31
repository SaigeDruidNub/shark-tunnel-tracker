import type { RouteLeg } from '../types/routeLeg';

export interface TruckPosition {
  /**
   * Index into the legs array of the leg currently being travelled (or the
   * nearest completed/upcoming leg when not actively moving).
   */
  legIndex: number;
  /**
   * Progress along legIndex's leg: 0 = at fromStop, 1 = at toStop.
   * Always clamped to [0, 1].
   */
  t: number;
  /** True only while the truck is actively between a departure and arrival. */
  isMoving: boolean;
}

/**
 * Pure function — no side effects, no imports beyond types.
 *
 * Given the static route legs and a "now" timestamp, returns the truck's
 * position as (legIndex, t, isMoving).
 *
 * Rules:
 * - Before the first departure  → legIndex 0, t 0, isMoving false
 * - Actively on leg i           → legIndex i, t ∈ (0,1), isMoving true
 * - Between legs (at a stop)    → legIndex of completed leg, t 1, isMoving false
 * - After the last arrival      → legIndex last, t 1, isMoving false
 */
export function getTruckPosition(legs: RouteLeg[], now: Date): TruckPosition {
  if (legs.length === 0) {
    return { legIndex: 0, t: 0, isMoving: false };
  }

  const nowMs = now.getTime();

  // Before the journey begins
  if (nowMs < legs[0].departureTime.getTime()) {
    return { legIndex: 0, t: 0, isMoving: false };
  }

  // After the entire journey is complete
  const lastLeg = legs[legs.length - 1];
  if (nowMs >= lastLeg.arrivalTime.getTime()) {
    return { legIndex: legs.length - 1, t: 1, isMoving: false };
  }

  // Find the active leg (departure ≤ now ≤ arrival)
  for (let i = 0; i < legs.length; i++) {
    const leg = legs[i];
    const depMs = leg.departureTime.getTime();
    const arrMs = leg.arrivalTime.getTime();

    if (nowMs >= depMs && nowMs <= arrMs) {
      const t = Math.min(1, Math.max(0, (nowMs - depMs) / (arrMs - depMs)));
      return { legIndex: i, t, isMoving: true };
    }

    // Between this leg's arrival and the next leg's departure (stopped at a city)
    if (i < legs.length - 1) {
      const nextDepMs = legs[i + 1].departureTime.getTime();
      if (nowMs > arrMs && nowMs < nextDepMs) {
        return { legIndex: i, t: 1, isMoving: false };
      }
    }
  }

  // Fallback — should be unreachable with a well-formed legs array
  return { legIndex: legs.length - 1, t: 1, isMoving: false };
}
