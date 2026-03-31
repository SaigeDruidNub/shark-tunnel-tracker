import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { routeLegs } from '../../data/routeLegs';
import { getTruckPosition } from '../../lib/truckInterpolation';
import styles from './DebugClock.module.css';

function toInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function DebugClock() {
  const { state, dispatch } = useAppContext();
  const [inputVal, setInputVal] = useState(() =>
    toInputValue(state.debugNow ?? new Date()),
  );
  const [open, setOpen] = useState(false);

  // Compile-time constant — hooks are always called before this return
  if (!import.meta.env.DEV) return null;

  const effectiveNow = state.debugNow ?? new Date();
  const pos = getTruckPosition(routeLegs, effectiveNow);
  const activeLeg = routeLegs[pos.legIndex];
  const isOverriding = state.debugNow !== null;

  function apply(date?: Date) {
    const d = date ?? new Date(inputVal);
    if (!isNaN(d.getTime())) {
      setInputVal(toInputValue(d));
      dispatch({ type: 'SET_DEBUG_TIME', date: d });
    }
  }

  function reset() {
    const now = new Date();
    setInputVal(toInputValue(now));
    dispatch({ type: 'CLEAR_DEBUG_TIME' });
  }

  return (
    <div className={styles.root}>
      {open && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>⏱ Time Override</span>
            {isOverriding && <span className={styles.activeBadge}>ACTIVE</span>}
          </div>

          <div className={styles.posInfo}>
            <span>
              Leg {pos.legIndex + 1}/{routeLegs.length}
              &ensp;·&ensp;t = {pos.t.toFixed(3)}
              &ensp;·&ensp;{pos.isMoving ? '🚚 moving' : '🛑 stopped'}
            </span>
            <span className={styles.legNames}>
              {activeLeg.fromStopId.replace(/-/g, ' ')} → {activeLeg.toStopId.replace(/-/g, ' ')}
            </span>
          </div>

          <input
            type="datetime-local"
            className={styles.input}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') apply(); }}
          />

          <div className={styles.btnRow}>
            <button className={styles.applyBtn} onClick={() => apply()}>Apply</button>
            <button className={styles.resetBtn} onClick={reset}>Real time</button>
          </div>

          <div className={styles.quickSection}>
            <div className={styles.quickLabel}>Quick jumps</div>
            <div className={styles.quickGrid}>
              {routeLegs.map((leg, i) => {
                const midTime = new Date(
                  leg.departureTime.getTime() +
                    (leg.arrivalTime.getTime() - leg.departureTime.getTime()) / 2,
                );
                return (
                  <button
                    key={i}
                    className={styles.quickBtn}
                    title={`Mid-point of leg ${i + 1}: ${leg.fromStopId} → ${leg.toStopId}`}
                    onClick={() => apply(midTime)}
                  >
                    Leg {i + 1}
                  </button>
                );
              })}
              <button
                className={styles.quickBtn}
                title="Before journey starts"
                onClick={() => apply(new Date(routeLegs[0].departureTime.getTime() - 3_600_000))}
              >
                Before
              </button>
              <button
                className={styles.quickBtn}
                title="After journey ends"
                onClick={() =>
                  apply(
                    new Date(
                      routeLegs[routeLegs.length - 1].arrivalTime.getTime() + 3_600_000,
                    ),
                  )
                }
              >
                After
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className={`${styles.toggle} ${isOverriding ? styles.toggleActive : ''}`}
        onClick={() => setOpen((o) => !o)}
        title="Toggle debug time override"
      >
        🕐 {isOverriding ? '⚠ DEBUG TIME' : 'DEV'}
      </button>
    </div>
  );
}
