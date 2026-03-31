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
      {/* Drop shadow */}
      <ellipse cx="0" cy="38" rx="70" ry="8" fill="#000" opacity="0.12" />

      {/* Shark truck PNG — 160×80 units, centered horizontally, sitting on route point */}
      <image
        href={sharkTruck}
        x="-80"
        y="-65"
        width="160"
        height="100"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Motion lines when moving */}
      {isMoving && (
        <g
          className={styles.motion}
          stroke="#9cd0ef"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        >
          <line x1="82" y1="-10" x2="98" y2="-10" />
          <line x1="82" y1="0" x2="94" y2="0" />
          <line x1="82" y1="10" x2="96" y2="10" />
        </g>
      )}
    </g>
  );
}
