import { useRef, useLayoutEffect, useState } from "react";
import { stops } from "../../data/stops";
import { useTruckPosition } from "../../hooks/useTruckPosition";
import { useTruckStatus } from "../../hooks/useTruckStatus";
import { useAppContext } from "../../context/AppContext";
import { MapSVG } from "./MapSVG";
import { StopMarker } from "./StopMarker";
import { TruckMarker } from "./TruckMarker";
import type { StopStatus } from "../../types/stop";

/**
 * Fractional positions [0..1] along the route path at each of the 8 stops.
 * Precomputed from MapSVG's route D string (mapBackground.png, 1152 × 922):
 * M905 243 L875 285 L783 345 L630 387 L545 658 L440 680 L378 635 L290 680
 *
 * Segment lengths (Euclidean — exact for straight-line L commands):
 *   0→1 (mineral-point→dubuque):   ≈ 51.6
 *   1→2 (dubuque→cedar-rapids):    ≈109.8
 *   2→3 (cedar-rapids→des-moines): ≈158.7
 *   3→4 (des-moines→kansas-city):  ≈284.0
 *   4→5 (kansas-city→topeka):      ≈107.3
 *   5→6 (topeka→manhattan):        ≈ 76.6
 *   6→7 (manhattan→salina):        ≈ 98.8
 *   Total ≈ 886.8
 *
 * Cumulative fractions at each stop (stops[0..7]):
 */
const STOP_PATH_FRACTIONS: readonly number[] = [
  0, // mineral-point  (0)
  0.058, // dubuque        ( 51.6 / 886.8)
  0.182, // cedar-rapids   (161.4 / 886.8)
  0.361, // des-moines     (320.1 / 886.8)
  0.681, // kansas-city    (604.1 / 886.8)
  0.802, // topeka         (711.4 / 886.8)
  0.889, // manhattan      (788.0 / 886.8)
  1.0, // salina
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

  const { state } = useAppContext();
  const { legIndex, t, isMoving } = useTruckPosition(
    state.debugNow ?? undefined,
  );
  const truckStatus = useTruckStatus();
  // showBubble may be undefined if the field was never explicitly toggled in the
  // studio — treat undefined/null as "show" so the default is always visible.
  const thoughtBubble =
    truckStatus?.showBubble !== false && truckStatus?.message
      ? truckStatus.message
      : null;

  // Map (legIndex, t) → SVG (x, y) via the ghost path element
  const truckPoint = (() => {
    if (!pathRef.current || totalLength === 0) {
      return { x: stops[0].svgX, y: stops[0].svgY };
    }
    const fromFrac = STOP_PATH_FRACTIONS[legIndex] ?? 0;
    const toFrac =
      STOP_PATH_FRACTIONS[
        Math.min(legIndex + 1, STOP_PATH_FRACTIONS.length - 1)
      ];
    const frac = fromFrac + (toFrac - fromFrac) * t;
    const pt = pathRef.current.getPointAtLength(frac * totalLength);
    return { x: pt.x, y: pt.y };
  })();

  const travelledLength = (() => {
    if (totalLength === 0) return 0;
    const fromFrac = STOP_PATH_FRACTIONS[legIndex] ?? 0;
    const toFrac =
      STOP_PATH_FRACTIONS[
        Math.min(legIndex + 1, STOP_PATH_FRACTIONS.length - 1)
      ];
    const frac = fromFrac + (toFrac - fromFrac) * t;
    return frac * totalLength;
  })();

  function getStopStatus(stopOrder: number, stopId: string): StopStatus {
    if (stopId === selectedStopId) return "active";
    // When t === 1 the truck has arrived at the destination stop of legIndex,
    // so treat it as having completed one extra leg for unlock purposes.
    const effectiveLeg = legIndex + (t >= 1 ? 1 : 0);
    if (stopOrder - 1 <= effectiveLeg) return "unlocked";
    return "locked";
  }

  return (
    <MapSVG ref={pathRef} travelledLength={travelledLength}>
      {/* Stop markers render first so the truck always paints on top */}
      {stops.filter((s) => !s.hideFromMap).map((stop) => (
        <StopMarker
          key={stop.id}
          stop={stop}
          status={getStopStatus(stop.order, stop.id)}
          onClick={() => onStopClick(stop.id)}
        />
      ))}
      <TruckMarker
        x={truckPoint.x}
        y={truckPoint.y}
        isMoving={isMoving}
        thoughtBubble={thoughtBubble}
      />
    </MapSVG>
  );
}
