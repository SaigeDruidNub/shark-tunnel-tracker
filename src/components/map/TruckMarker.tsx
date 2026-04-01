import sharkTruck from "../../assets/sharkTruck.png";
import styles from "./TruckMarker.module.css";

interface TruckMarkerProps {
  /** SVG user-unit coordinates resolved by RouteMap via getPointAtLength() */
  x: number;
  y: number;
  isMoving: boolean;
  /** If set, displays a comic-style thought bubble above the truck. */
  thoughtBubble?: string | null;
}

/**
 * Breaks a string into lines of at most `maxChars` characters, splitting on
 * word boundaries. Returns at most 3 lines; longer text is truncated with "…".
 */
function wrapText(text: string, maxChars = 26): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars) {
      if (current) lines.push(current);
      current =
        word.length > maxChars ? word.slice(0, maxChars - 1) + "…" : word;
    } else {
      current = candidate;
    }
    if (lines.length >= 2 && current) {
      // Max 3 lines — truncate the third if needed
      lines.push(
        current.length > maxChars
          ? current.slice(0, maxChars - 1) + "…"
          : current,
      );
      current = "";
      break;
    }
  }
  if (current && lines.length < 3) lines.push(current);
  return lines;
}

/**
 * Shark truck marker rendered as an SVG <g> at the given (x, y) coordinates.
 *
 * Position is CSS-transitioned so the truck slides smoothly along the route
 * each time x/y change (i.e. each 1-minute poll tick).
 *
 * prefers-reduced-motion disables the transition.
 */
export function TruckMarker({
  x,
  y,
  isMoving,
  thoughtBubble,
}: TruckMarkerProps) {
  const lines = thoughtBubble ? wrapText(thoughtBubble) : [];

  // Bubble geometry (SVG user units)
  const fontSize = 14;
  const lineHeight = fontSize * 1.35;
  const padY = 14;
  const bubbleW = 240;
  const bubbleH = lines.length * lineHeight + padY * 2;
  const bubbleX = -bubbleW / 2;
  // Bubble bottom sits 10 units above the last thought dot (which tops at y≈-115)
  const bubbleBottom = -125;
  const bubbleY = bubbleBottom - bubbleH;

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

        {/* Thought bubble — only rendered when a message is set */}
        {lines.length > 0 && (
          <g className={styles.bubble}>
            {/* Thought dots — small circles rising from the truck roof */}
            <circle
              cx="-4"
              cy="-75"
              r="4"
              fill="white"
              stroke="#1a1a2e"
              strokeWidth="1.5"
            />
            <circle
              cx="-13"
              cy="-92"
              r="7"
              fill="white"
              stroke="#1a1a2e"
              strokeWidth="1.5"
            />
            <circle
              cx="-24"
              cy="-113"
              r="10"
              fill="white"
              stroke="#1a1a2e"
              strokeWidth="1.5"
            />

            {/* Bubble body */}
            <rect
              x={bubbleX}
              y={bubbleY}
              width={bubbleW}
              height={bubbleH}
              rx="18"
              ry="18"
              fill="white"
              stroke="#1a1a2e"
              strokeWidth="2"
            />

            {/* Text lines */}
            {lines.map((line, i) => (
              <text
                key={i}
                x="0"
                y={bubbleY + padY + (i + 0.82) * lineHeight}
                textAnchor="middle"
                fontSize={fontSize}
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="600"
                fill="#1a1a2e"
              >
                {line}
              </text>
            ))}
          </g>
        )}
      </g>
    </g>
  );
}
