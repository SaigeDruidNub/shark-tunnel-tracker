import { describe, it, expect } from 'vitest';
import { getTruckPosition } from '../lib/truckInterpolation';
import type { RouteLeg } from '../types/routeLeg';

// Two legs for testing: Leg A 08:00–10:00, Leg B 11:00–13:00
const legs: RouteLeg[] = [
  {
    fromStopId: 'stop-a',
    toStopId: 'stop-b',
    departureTime: new Date('2026-04-10T08:00:00Z'),
    arrivalTime: new Date('2026-04-10T10:00:00Z'),
  },
  {
    fromStopId: 'stop-b',
    toStopId: 'stop-c',
    departureTime: new Date('2026-04-10T11:00:00Z'),
    arrivalTime: new Date('2026-04-10T13:00:00Z'),
  },
];

describe('getTruckPosition', () => {
  it('returns legIndex 0, t 0, not moving before journey starts', () => {
    const now = new Date('2026-04-10T07:00:00Z');
    expect(getTruckPosition(legs, now)).toEqual({ legIndex: 0, t: 0, isMoving: false });
  });

  it('returns t 0.5 at the midpoint of leg 0', () => {
    const now = new Date('2026-04-10T09:00:00Z'); // 1hr into a 2hr leg
    const result = getTruckPosition(legs, now);
    expect(result.legIndex).toBe(0);
    expect(result.t).toBeCloseTo(0.5);
    expect(result.isMoving).toBe(true);
  });

  it('returns t 0 at the exact departure of leg 0', () => {
    const result = getTruckPosition(legs, new Date('2026-04-10T08:00:00Z'));
    expect(result.legIndex).toBe(0);
    expect(result.t).toBe(0);
    expect(result.isMoving).toBe(true);
  });

  it('returns t 1 at the exact arrival of leg 0', () => {
    const result = getTruckPosition(legs, new Date('2026-04-10T10:00:00Z'));
    expect(result.legIndex).toBe(0);
    expect(result.t).toBe(1);
    expect(result.isMoving).toBe(true);
  });

  it('returns legIndex 0, t 1, not moving when stopped between legs', () => {
    const now = new Date('2026-04-10T10:30:00Z'); // between 10:00 arrival and 11:00 departure
    const result = getTruckPosition(legs, now);
    expect(result.legIndex).toBe(0);
    expect(result.t).toBe(1);
    expect(result.isMoving).toBe(false);
  });

  it('returns t 0.25 at one quarter through leg 1', () => {
    const now = new Date('2026-04-10T11:30:00Z'); // 30min into a 2hr leg
    const result = getTruckPosition(legs, now);
    expect(result.legIndex).toBe(1);
    expect(result.t).toBeCloseTo(0.25);
    expect(result.isMoving).toBe(true);
  });

  it('returns last leg, t 1, not moving after journey ends', () => {
    const now = new Date('2026-04-10T14:00:00Z');
    const result = getTruckPosition(legs, now);
    expect(result.legIndex).toBe(1);
    expect(result.t).toBe(1);
    expect(result.isMoving).toBe(false);
  });

  it('handles an empty legs array gracefully', () => {
    expect(getTruckPosition([], new Date())).toEqual({ legIndex: 0, t: 0, isMoving: false });
  });

  it('clamps t to [0, 1] even with identical departure and arrival times', () => {
    const dedge: RouteLeg[] = [{
      fromStopId: 'a',
      toStopId: 'b',
      departureTime: new Date('2026-04-10T08:00:00Z'),
      arrivalTime: new Date('2026-04-10T08:00:00Z'),
    }];
    const result = getTruckPosition(dedge, new Date('2026-04-10T08:00:00Z'));
    expect(result.t).toBeGreaterThanOrEqual(0);
    expect(result.t).toBeLessThanOrEqual(1);
  });
});
