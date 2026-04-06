import { forwardRef } from "react";
import mapBackground from "../../assets/mapBackground.png";

interface MapSVGProps {
  /** Stop markers and truck marker rendered by RouteMap */
  children?: React.ReactNode;
  /** How many SVG units of the path have been travelled — draws a solid overlay */
  travelledLength?: number;
}

/**
 * MapSVG — PNG map background with SVG route path overlay.
 *
 * viewBox: 1152 × 922 (matches mapBackground.png dimensions).
 *
 * The ref is forwarded to the ghost route <path> so RouteMap can call
 * pathEl.getTotalLength() and pathEl.getPointAtLength() for truck positioning.
 *
 * Stop coordinates in src/data/stops.ts must match pixel positions on the PNG.
 * Route: Mineral Point, WI → Eagle Point Park (Dubuque, IA) → Van Buren Elementary (IA)
 *        → Science Center of Iowa (Des Moines) → National WWI Museum (KC, MO)
 *        → Logan Elementary (KC, KS) → Elmont Elementary (KS)
 *        → Woodrow Wilson Elementary (Abilene, KS) → Salina, KS
 */
const MapSVG = forwardRef<SVGPathElement, MapSVGProps>(function MapSVG(
  { children, travelledLength = 0 },
  routePathRef,
) {
  // Coordinates mirror svgX/svgY in src/data/stops.ts.
  // Update both together whenever stop positions change.
  const routeD =
    "M905 243 L868 281 L719 335 L628 387 L552 670 L520 680 L439 650 L341 688 L290 680";

  return (
    <svg
      viewBox="0 20 1152 718"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustrated Shark Tunnel Tracker route map from Mineral Point to Salina, Kansas"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {/* PNG map background — rendered first so route and markers sit on top */}
      <image
        href={mapBackground}
        x="0"
        y="0"
        width="1152"
        height="922"
        preserveAspectRatio="xMidYMid meet"
      />

      <defs>
        <linearGradient id="routeFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6B4AC9" />
          <stop offset="100%" stopColor="#4d40b2" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2"
            floodColor="#25342e"
            floodOpacity="0.12"
          />
        </filter>
      </defs>

      <g id="route" filter="url(#softShadow)">
        {/* Dashed outline for untravelled path */}
        <path
          d={routeD}
          stroke="#2E1B69"
          strokeWidth="17"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 28"
          fill="none"
        />
        <path
          d={routeD}
          stroke="url(#routeFill)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 28"
          fill="none"
        />
        {/* Solid overlay for travelled portion */}
        {travelledLength > 0 && (
          <>
            <path
              d={routeD}
              stroke="#2E1B69"
              strokeWidth="17"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${travelledLength} 99999`}
              fill="none"
            />
            <path
              d={routeD}
              stroke="url(#routeFill)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${travelledLength} 99999`}
              fill="none"
            />
          </>
        )}
        {/* Ghost path — ref target for getPointAtLength() */}
        <path
          ref={routePathRef}
          d={routeD}
          stroke="transparent"
          strokeWidth="1"
          fill="none"
        />
      </g>

      {/* Stop markers + truck — rendered by RouteMap as children */}
      {children}
    </svg>
  );
});

export { MapSVG };
