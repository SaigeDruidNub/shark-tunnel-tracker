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
 * Fractional positions [0..1] along the route path at each of the 9 stops.
 * Precomputed from MapSVG's route D string (mapBackground.png, 1152 × 922):
 * M905 243 L868 281 L719 335 L628 387 L552 670 L520 680 L439 650 L341 688 L290 680
 *
 * Segment lengths (Euclidean — exact for straight-line L commands):
 *   0→1 (mineral-point→eagle-point-park):          ≈  53.0
 *   1→2 (eagle-point-park→van-buren-elementary):   ≈ 158.5
 *   2→3 (van-buren-elementary→science-center-iowa):≈ 104.8
 *   3→4 (science-center-iowa→national-wwi-museum): ≈ 293.0
 *   4→5 (national-wwi-museum→elmont-elementary):   ≈  33.5
 *   5→6 (elmont-elementary→logan-elementary):      ≈  86.4
 *   6→7 (logan-elementary→woodrow-wilson):         ≈ 105.1
 *   7→8 (woodrow-wilson→salina):                   ≈  51.6
 *   Total ≈ 885.9
 *
 * Cumulative fractions at each stop (stops[0..8]):
 */
const STOP_PATH_FRACTIONS: readonly number[] = [
  0, // mineral-point          (0)
  0.06, // eagle-point-park       ( 53.0 / 885.9)
  0.239, // van-buren-elementary   (211.5 / 885.9)
  0.357, // science-center-iowa    (316.3 / 885.9)
  0.688, // national-wwi-museum    (609.3 / 885.9)
  0.726, // elmont-elementary      (642.8 / 885.9)
  0.823, // logan-elementary       (729.2 / 885.9)
  0.942, // woodrow-wilson         (834.3 / 885.9)
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
      {stops
        .filter((s) => !s.hideFromMap)
        .map((stop) => (
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
