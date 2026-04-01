import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { sanityImageUrl } from "../../lib/sanity/imageUrl";
import { stops } from "../../data/stops";
import type { PhotoSubmission } from "../../types/photoSubmission";
import styles from "./Lightbox.module.css";

function stopNameById(id: string): string {
  const match = stops.find((s) => s.id === id);
  return match ? `${match.name}, ${match.state}` : id;
}

function toYouTubeEmbedUrl(watchUrl: string): string | null {
  try {
    const url = new URL(watchUrl);
    if (!url.hostname.includes("youtube") && !url.hostname.includes("youtu.be"))
      return null;
    const videoId =
      url.searchParams.get("v") ??
      url.pathname.split("/").filter(Boolean).pop() ??
      "";
    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

interface LightboxProps {
  item: PhotoSubmission;
  onClose: () => void;
}

export function Lightbox({ item, onClose }: LightboxProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const embedUrl = item.videoUrl ? toYouTubeEmbedUrl(item.videoUrl) : null;
  const fullImageUrl = item.image
    ? sanityImageUrl(item.image).width(1200).format("webp").url()
    : null;

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className={styles.lightboxOverlay}
      role="dialog"
      aria-modal="true"
      aria-label={item.caption || "Photo submission"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.lightboxBox}>
        <button
          ref={closeBtnRef}
          className={styles.lightboxClose}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {embedUrl ? (
          <div className={styles.lightboxVideo}>
            <iframe
              src={embedUrl}
              title={item.caption || "Video submission"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.lightboxIframe}
            />
          </div>
        ) : fullImageUrl ? (
          <img
            src={fullImageUrl}
            alt={item.caption}
            className={styles.lightboxImage}
          />
        ) : null}

        {item.caption && (
          <p className={styles.lightboxCaption}>{item.caption}</p>
        )}
        <p className={styles.lightboxMeta}>
          {item.submitterName}
          {item.relatedStopId && ` · ${stopNameById(item.relatedStopId)}`}
        </p>
      </div>
    </div>,
    document.body,
  );
}
