import { forwardRef } from 'react';
import mapBackground from '../../assets/mapBackground.png';

interface MapSVGProps {
  /** Stop markers and truck marker rendered by RouteMap */
  children?: React.ReactNode;
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
 * Route: Mineral Point, WI → Dubuque → Cedar Rapids → Des Moines → Kansas City
 *        → Topeka → Manhattan → Salina, KS
 */
const MapSVG = forwardRef<SVGPathElement, MapSVGProps>(function MapSVG(
  { children },
  routePathRef,
) {
  // Coordinates mirror svgX/svgY in src/data/stops.ts.
  // Update both together whenever stop positions change.
  const routeD =
    'M905 243 L875 285 L783 345 L630 387 L545 658 L440 680 L378 635 L290 680';

  return (
    <svg
      viewBox="0 0 1152 922"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustrated Shark Tunnel Tracker route map from Mineral Point to Salina, Kansas"
      style={{ width: '100%', height: '100%', display: 'block' }}
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
          <stop offset="0%" stopColor="#3c8fd2" />
          <stop offset="100%" stopColor="#2e73b7" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#25342e" floodOpacity="0.12" />
        </filter>
      </defs>

      <g id="route" filter="url(#softShadow)">
        <path
          d={routeD}
          stroke="#17304a"
          strokeWidth="17"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d={routeD}
          stroke="url(#routeFill)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
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
