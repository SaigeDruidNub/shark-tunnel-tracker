import type { Stop, StopStatus } from "../../types/stop";
import styles from "./StopMarker.module.css";

interface StopMarkerProps {
  stop: Stop;
  status: StopStatus;
  onClick: () => void;
}

const STATUS_COLORS: Record<
  StopStatus,
  { outer: string; inner: string; text: string }
> = {
  locked: { outer: "#8e9aaa", inner: "#c7d0db", text: "#555e6a" },
  unlocked: { outer: "#2f5f95", inner: "#9cd0ef", text: "#111" },
  active: { outer: "#f0b429", inner: "#fff6dc", text: "#5a3a00" },
};

export function StopMarker({ stop, status, onClick }: StopMarkerProps) {
  const { outer, inner, text } = STATUS_COLORS[status];
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  }

  return (
    <g
      id={`marker-${stop.id}`}
      className={styles.marker}
      data-status={status}
      role="button"
      aria-label={`${stop.name}, ${stop.state} — ${status}`}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      transform={`translate(${stop.svgX} ${stop.svgY})`}
    >
      {/* Active pulse ring */}
      {status === "active" && (
        <circle
          r="24"
          fill="none"
          stroke="#f0b429"
          strokeWidth="3"
          opacity="0.6"
          className={styles.pulse}
        />
      )}

      {/* Outer circle */}
      <circle
        r="15"
        fill={outer}
        stroke={status === "active" ? "#b07800" : "#0f2236"}
        strokeWidth="3"
      />

      {/* Inner circle */}
      <circle r="11" fill={inner} opacity="0.95" />

      {/* Stop number */}
      <text
        dy="1"
        style={{
          fontFamily: "Inter, Arial, sans-serif",
          fontWeight: 800,
          fontSize: 16,
          fill: text,
          textAnchor: "middle",
          dominantBaseline: "middle",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {stop.order}
      </text>

      {/* City label — rendered twice: white outline behind, black text on top */}
      <text
        x={18}
        dy="1"
        style={{
          fontFamily: "Inter, Arial, sans-serif",
          fontWeight: 700,
          fontSize: 15,
          fill: "none",
          stroke: "white",
          strokeWidth: 4,
          strokeLinejoin: "round",
          dominantBaseline: "middle",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {stop.name}
      </text>
      <text
        x={18}
        dy="1"
        style={{
          fontFamily: "Inter, Arial, sans-serif",
          fontWeight: 700,
          fontSize: 15,
          fill: "#1d1d1d",
          dominantBaseline: "middle",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {stop.name}
      </text>
    </g>
  );
}
