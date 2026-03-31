import styles from './TruckMarker.module.css';

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
      style={{ transform: `translate(${x}px, ${y}px)` }}
      aria-label={isMoving ? 'Shark tunnel in transit' : 'Shark tunnel stopped'}
      role="img"
    >
      {/* Drop shadow */}
      <ellipse cx="0" cy="14" rx="22" ry="5" fill="#000" opacity="0.15" />

      {/* Truck body */}
      <rect x="-22" y="-10" width="44" height="22" rx="4" fill="#2f5f95" />

      {/* Cab */}
      <rect x="-22" y="-22" width="20" height="14" rx="3" fill="#1d3f6e" />

      {/* Cab window */}
      <rect x="-19" y="-20" width="13" height="8" rx="2" fill="#9cd0ef" opacity="0.9" />

      {/* Shark fin on top of cab */}
      <path d="M-14 -22 L-6 -38 L2 -22 Z" fill="#f0b429" stroke="#b07800" strokeWidth="1.5" />
      <path d="M-10 -22 L-6 -32 L2 -22 Z" fill="#ffd166" />

      {/* Shark eye on cab */}
      <circle cx="-10" cy="-14" r="2" fill="#fff" />
      <circle cx="-10" cy="-14" r="1" fill="#1a1a2e" />

      {/* Shark mouth on front bumper */}
      <path d="M-22 -4 L-28 -4 L-28 2 L-22 2" fill="#1d3f6e" />
      <path
        d="M-28 -4 L-34 -1 M-34 -1 L-28 2"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="-25" cy="-1" r="1.5" fill="#9cd0ef" opacity="0.8" />

      {/* Logo text on body */}
      <text
        x="4"
        y="4"
        style={{
          fontFamily: 'Inter, Arial, sans-serif',
          fontWeight: 800,
          fontSize: 8,
          fill: '#fff',
          textAnchor: 'middle',
          dominantBaseline: 'middle',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        SHARK
      </text>

      {/* Wheels */}
      <circle cx="-12" cy="12" r="7" fill="#1a1a2e" />
      <circle cx="-12" cy="12" r="4" fill="#555" />
      <circle cx="-12" cy="12" r="2" fill="#aaa" />
      <circle cx="10" cy="12" r="7" fill="#1a1a2e" />
      <circle cx="10" cy="12" r="4" fill="#555" />
      <circle cx="10" cy="12" r="2" fill="#aaa" />

      {/* Motion lines when moving */}
      {isMoving && (
        <g className={styles.motion} stroke="#9cd0ef" strokeWidth="2" strokeLinecap="round" opacity="0.7">
          <line x1="24" y1="-6" x2="36" y2="-6" />
          <line x1="24" y1="-1" x2="32" y2="-1" />
          <line x1="24" y1="4" x2="34" y2="4" />
        </g>
      )}
    </g>
  );
}
