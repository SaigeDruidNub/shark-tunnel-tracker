import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { stops } from "../../data/stops";
import { useAppContext } from "../../context/AppContext";
import { useStopRecap } from "../../hooks/useStopRecap";
import styles from "./StopModal.module.css";

/** Converts a youtube.com watch URL to a youtube-nocookie.com embed URL. Returns null for non-YouTube. */
function toYouTubeEmbedUrl(watchUrl: string): string | null {
  try {
    const url = new URL(watchUrl);
    if (
      !url.hostname.includes("youtube") &&
      !url.hostname.includes("youtu.be")
    ) {
      return null;
    }
    const videoId =
      url.searchParams.get("v") ??
      url.pathname.split("/").filter(Boolean).pop() ??
      "";
    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

function isSnapchat(url: string): boolean {
  try {
    return new URL(url).hostname.includes("snapchat");
  } catch {
    return false;
  }
}

/** All focusable elements we want the focus trap to cycle through. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function StopModal() {
  const { state, dispatch } = useAppContext();
  const { selectedStopId } = state;

  const stop = selectedStopId
    ? (stops.find((s) => s.id === selectedStopId) ?? null)
    : null;
  const { data: recap } = useStopRecap(selectedStopId);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Move focus into dialog when it opens; restore to previously focused element on close
  useEffect(() => {
    if (!stop) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    return () => {
      previouslyFocused?.focus();
    };
  }, [stop]);

  // ESC to close + focus trap
  useEffect(() => {
    if (!stop) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        dispatch({ type: "CLOSE_STOP" });
        return;
      }

      if (e.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [stop, dispatch]);

  // Prevent body scroll while open
  useEffect(() => {
    if (stop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [stop]);

  if (!stop) return null;

  const videoUrl = recap?.videoUrl ?? stop.videoUrl;
  const embedUrl = videoUrl ? toYouTubeEmbedUrl(videoUrl) : null;
  const snapchat = videoUrl && !embedUrl && isSnapchat(videoUrl);
  const titleId = `stop-modal-title-${stop.id}`;

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={() => dispatch({ type: "CLOSE_STOP" })}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        aria-hidden={undefined}
      >
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.stopNumber}>Stop {stop.order}</span>
          <h2 id={titleId} className={styles.title}>
            {stop.name}
            <span className={styles.stateChip}>{stop.state}</span>
          </h2>
          <button
            ref={closeBtnRef}
            className={styles.closeBtn}
            aria-label="Close stop details"
            onClick={() => dispatch({ type: "CLOSE_STOP" })}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <p className={styles.description}>{stop.description}</p>

          {recap?.blurb && <p className={styles.recapBlurb}>{recap.blurb}</p>}

          {embedUrl && (
            <div className={styles.videoWrapper}>
              <iframe
                src={embedUrl}
                title={`Video about ${stop.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className={styles.iframe}
              />
            </div>
          )}

          {snapchat && videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.videoLink}
            >
              Watch on Snapchat ↗
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
