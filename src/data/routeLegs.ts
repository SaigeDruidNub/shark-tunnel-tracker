import type { RouteLeg } from '../types/routeLeg';

/**
 * The 7 driving legs connecting the 8 stops.
 *
 * The truck's animated position on the map is computed by interpolating
 * between departureTime and arrivalTime for whichever leg is currently active.
 *
 * To move the truck: update the Date strings below and redeploy.
 * Times are in US Central time (UTC-5 in April, CDT).
 *
 * Leg order matches stop order: leg[0] goes from stop 1 → stop 2, etc.
 */
export const routeLegs: RouteLeg[] = [
  {
    // Day 1, morning: Mineral Point → Dubuque (~1.5 hrs)
    fromStopId: 'mineral-point',
    toStopId: 'dubuque',
    departureTime: new Date('2026-04-10T08:00:00-05:00'),
    arrivalTime: new Date('2026-04-10T09:30:00-05:00'),
  },
  {
    // Day 1, mid-morning: Dubuque → Cedar Rapids (~1.5 hrs)
    fromStopId: 'dubuque',
    toStopId: 'cedar-rapids',
    departureTime: new Date('2026-04-10T10:00:00-05:00'),
    arrivalTime: new Date('2026-04-10T11:30:00-05:00'),
  },
  {
    // Day 1, afternoon: Cedar Rapids → Des Moines (~2 hrs)
    fromStopId: 'cedar-rapids',
    toStopId: 'des-moines',
    departureTime: new Date('2026-04-10T12:00:00-05:00'),
    arrivalTime: new Date('2026-04-10T14:00:00-05:00'),
  },
  {
    // Day 1, late afternoon: Des Moines → Kansas City (~3 hrs)
    fromStopId: 'des-moines',
    toStopId: 'kansas-city',
    departureTime: new Date('2026-04-10T15:00:00-05:00'),
    arrivalTime: new Date('2026-04-10T18:00:00-05:00'),
  },
  {
    // Day 2, morning: Kansas City → Topeka (~1.5 hrs)
    fromStopId: 'kansas-city',
    toStopId: 'topeka',
    departureTime: new Date('2026-04-11T08:00:00-05:00'),
    arrivalTime: new Date('2026-04-11T09:30:00-05:00'),
  },
  {
    // Day 2, mid-morning: Topeka → Manhattan (~1.25 hrs)
    fromStopId: 'topeka',
    toStopId: 'manhattan',
    departureTime: new Date('2026-04-11T10:00:00-05:00'),
    arrivalTime: new Date('2026-04-11T11:15:00-05:00'),
  },
  {
    // Day 2, afternoon: Manhattan → Salina (~1.25 hrs)
    fromStopId: 'manhattan',
    toStopId: 'salina',
    departureTime: new Date('2026-04-11T13:00:00-05:00'),
    arrivalTime: new Date('2026-04-11T14:15:00-05:00'),
  },
];
