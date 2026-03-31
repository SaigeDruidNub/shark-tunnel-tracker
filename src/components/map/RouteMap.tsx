import { useRef, useLayoutEffect, useState } from 'react';
import { stops } from '../../data/stops';
import { useTruckPosition } from '../../hooks/useTruckPosition';
import { MapSVG } from './MapSVG';
import { StopMarker } from './StopMarker';
import { TruckMarker } from './TruckMarker';
import type { StopStatus } from '../../types/stop';

/**
 * Fractional positions [0..1] along the route path at each of the 8 stops.
 * Precomputed from the polyline segment lengths in MapSVG's route D string:
 * M1090 248 L1018 346 L950 414 L782 414 L748 465 L748 585 L708 633 L662 725 L564 812 L456 838
 *
 * Segment lengths (Euclidean — exact for straight-line L commands):
 *   0→1 (mineral-point→dubuque):     ≈121.6
 *   1→2 (dubuque→cedar-rapids):      ≈ 96.2
 *   2→3 (waypoint):                  = 168.0
 *   3→4 (waypoint→des-moines):       ≈ 61.3
 *   4→5 (waypoint):                  = 120.0
 *   5→6 (waypoint→kansas-city):      ≈ 62.5
 *   6→7 (kansas-city→topeka):        ≈102.9
 *   7→8 (topeka→manhattan):          ≈131.0
 *   8→9 (manhattan→salina):          ≈111.1
 *   Total ≈ 974.6
 *
 * Cumulative fractions at each stop (stops[0..7]):
 */
const STOP_PATH_FRACTIONS: readonly number[] = [
  0,      // mineral-point  (0)
  0.125,  // dubuque        (121.6 / 974.6)
  0.223,  // cedar-rapids   (217.8 / 974.6)
  0.459,  // des-moines     (447.1 / 974.6)
  0.646,  // kansas-city    (629.6 / 974.6)
  0.752,  // topeka         (732.5 / 974.6)
  0.886,  // manhattan      (863.5 / 974.6)
  1.0,    // salina
];

interface RouteMapProps {
  /** The stop id currently open in the modal, or null. Drives 'active' state. */
  selectedStopId: string | null;
  /** Called when the user clicks / keyboards an unlocked stop marker. */
  onStopClick: (stopId: string) => void;
}

/**
 * RouteMap — container component that composes:
 *   MapSVG (background + ghost path ref)
 *   StopMarker ×8 (locked / unlocked / active)
 *   TruckMarker (getPointAtLength-driven position)
 *
 * Owns the SVG path ref and truck-position state.
 * Rendered inside Layout's map panel.
 */
export function RouteMap({ selectedStopId, onStopClick }: RouteMapProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [totalLength, setTotalLength] = useState(0);

  // Measure path length after first paint so getPointAtLength is available
  useLayoutEffect(() => {
    if (pathRef.current) {
      setTotalLength(pathRef.current.getTotalLength());
    }
  }, []);

  const { legIndex, t, isMoving } = useTruckPosition();

  // Map (legIndex, t) → SVG (x, y) via the ghost path element
  const truckPoint = (() => {
    if (!pathRef.current || totalLength === 0) {
      return { x: stops[0].svgX, y: stops[0].svgY };
    }
    const fromFrac = STOP_PATH_FRACTIONS[legIndex] ?? 0;
    const toFrac = STOP_PATH_FRACTIONS[Math.min(legIndex + 1, STOP_PATH_FRACTIONS.length - 1)];
    const frac = fromFrac + (toFrac - fromFrac) * t;
    const pt = pathRef.current.getPointAtLength(frac * totalLength);
    return { x: pt.x, y: pt.y };
  })();

  function getStopStatus(stopOrder: number, stopId: string): StopStatus {
    if (stopId === selectedStopId) return 'active';
    // stop.order is 1-based; truck is currently on 0-based leg legIndex
    // → stops with order ≤ legIndex + 1 have been departed from (unlocked)
    if (stopOrder - 1 <= legIndex) return 'unlocked';
    return 'locked';
  }

  return (
    <MapSVG ref={pathRef}>
      {/* Stop markers render first so the truck always paints on top */}
      {stops.map((stop) => (
        <StopMarker
          key={stop.id}
          stop={stop}
          status={getStopStatus(stop.order, stop.id)}
          onClick={() => onStopClick(stop.id)}
        />
      ))}
      <TruckMarker x={truckPoint.x} y={truckPoint.y} isMoving={isMoving} />
    </MapSVG>
  );
}
