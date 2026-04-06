import type { RouteLeg } from "../types/routeLeg";

/**
 * The 8 driving legs connecting the 9 stops.
 *
 * Times are US Central Daylight Time (CDT, UTC-5 in April).
 * Leg order matches stop order: leg[0] goes from stop 1 → stop 2, etc.
 */
export const routeLegs: RouteLeg[] = [
  {
    // Day 1, morning: Mineral Point → Eagle Point Park (~1h 45m)
    fromStopId: "mineral-point",
    toStopId: "eagle-point-park",
    departureTime: new Date("2026-04-09T06:00:00-05:00"),
    arrivalTime: new Date("2026-04-09T07:45:00-05:00"),
  },
  {
    // Day 1, mid-morning: Eagle Point Park → Van Buren Elementary (~2h)
    fromStopId: "eagle-point-park",
    toStopId: "van-buren-elementary",
    departureTime: new Date("2026-04-09T08:00:00-05:00"),
    arrivalTime: new Date("2026-04-09T10:00:00-05:00"),
  },
  {
    // Day 1, late morning: Van Buren Elementary → Science Center of Iowa (~2h)
    fromStopId: "van-buren-elementary",
    toStopId: "science-center-iowa",
    departureTime: new Date("2026-04-09T10:15:00-05:00"),
    arrivalTime: new Date("2026-04-09T12:15:00-05:00"),
  },
  {
    // Day 1, afternoon: Science Center of Iowa → National WWI Museum (~2h 45m)
    fromStopId: "science-center-iowa",
    toStopId: "national-wwi-museum",
    departureTime: new Date("2026-04-09T12:30:00-05:00"),
    arrivalTime: new Date("2026-04-09T15:15:00-05:00"),
  },
  {
    // Day 2, morning: National WWI Museum → Elmont Elementary (~1h 15m)
    fromStopId: "national-wwi-museum",
    toStopId: "elmont-elementary",
    departureTime: new Date("2026-04-10T08:00:00-05:00"),
    arrivalTime: new Date("2026-04-10T09:15:00-05:00"),
  },
  {
    // Day 2, mid-morning: Elmont Elementary → Logan Elementary (~30m)
    fromStopId: "elmont-elementary",
    toStopId: "logan-elementary",
    departureTime: new Date("2026-04-10T09:30:00-05:00"),
    arrivalTime: new Date("2026-04-10T10:00:00-05:00"),
  },
  {
    // Day 2, late morning: Logan Elementary → Woodrow Wilson Elementary (~45m)
    fromStopId: "logan-elementary",
    toStopId: "woodrow-wilson-elementary",
    departureTime: new Date("2026-04-10T10:15:00-05:00"),
    arrivalTime: new Date("2026-04-10T11:00:00-05:00"),
  },
  {
    // Day 2, afternoon: Woodrow Wilson Elementary → Salina (~3h)
    fromStopId: "woodrow-wilson-elementary",
    toStopId: "salina",
    departureTime: new Date("2026-04-10T11:30:00-05:00"),
    arrivalTime: new Date("2026-04-10T14:00:00-05:00"),
  },
];
