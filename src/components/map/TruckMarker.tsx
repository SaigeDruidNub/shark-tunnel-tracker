import sharkTruck from "../../assets/sharkTruck.png";
import styles from "./TruckMarker.module.css";

interface TruckMarkerProps {
  /** SVG user-unit coordinates resolved by RouteMap via getPointAtLength() */
  x: number;
  y: number;
  isMoving: boolean;
}

/**
 * Shark truck marker rendered as an SVG <g> at the given (x, y) coordinates.
 *
 * Position is CSS-transitioned so the truck slides smoothly along the route
 * each time x/y change (i.e. each 1-minute poll tick).
 *
 * prefers-reduced-motion disables the transition.
 */
export function TruckMarker({ x, y, isMoving }: TruckMarkerProps) {
  return (
    <g
      className={styles.truck}
      style={{ transform: `translate(${x}px, ${y}px)`, pointerEvents: "none" }}
      aria-label={isMoving ? "Shark tunnel in transit" : "Shark tunnel stopped"}
      role="img"
    >
      {/* Inner group animates the bob — separate from the position transition */}
      <g className={styles.bob}>
        {/* Shark truck PNG — 160×80 units, centered horizontally, sitting on route point */}
        <image
          href={sharkTruck}
          x="-80"
          y="-65"
          width="160"
          height="100"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Motion lines when moving — two passes for outline contrast */}
        {isMoving && (
          <>
            {/* Outline pass: wide white stroke behind the color */}
            <g
              className={styles.motion}
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.75"
            >
              <line x1="72" y1="-28" x2="88" y2="-28" />
              <line x1="72" y1="-18" x2="84" y2="-18" />
              <line x1="72" y1="-8" x2="86" y2="-8" />
            </g>
            {/* Color pass: bright blue on top */}
            <g
              className={styles.motion}
              stroke="#5bb8f5"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="1"
            >
              <line x1="72" y1="-28" x2="88" y2="-28" />
              <line x1="72" y1="-18" x2="84" y2="-18" />
              <line x1="72" y1="-8" x2="86" y2="-8" />
            </g>
          </>
        )}
      </g>
    </g>
  );
}
