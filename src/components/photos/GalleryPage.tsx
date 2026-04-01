import { useState } from "react";
import { usePhotoSubmissions } from "../../hooks/usePhotoSubmissions";
import { sanityImageUrl } from "../../lib/sanity/imageUrl";
import { stops } from "../../data/stops";
import type { PhotoSubmission } from "../../types/photoSubmission";
import { Lightbox } from "./Lightbox";
import styles from "./GalleryPage.module.css";

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

function toYouTubeThumbnailUrl(watchUrl: string): string | null {
  try {
    const url = new URL(watchUrl);
    if (!url.hostname.includes("youtube") && !url.hostname.includes("youtu.be"))
      return null;
    const videoId =
      url.searchParams.get("v") ??
      url.pathname.split("/").filter(Boolean).pop() ??
      "";
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null;
  } catch {
    return null;
  }
}

// ── Gallery card ──────────────────────────────────────────────────────────────

function GalleryCard({
  item,
  onOpen,
}: {
  item: PhotoSubmission;
  onOpen: () => void;
}) {
  const embedUrl = item.videoUrl ? toYouTubeEmbedUrl(item.videoUrl) : null;
  const thumbUrl = item.image
    ? sanityImageUrl(item.image)
        .width(600)
        .height(400)
        .fit("crop")
        .format("webp")
        .url()
    : item.videoUrl
      ? toYouTubeThumbnailUrl(item.videoUrl)
      : null;

  const submittedDate = new Date(item.submittedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <article
      className={styles.card}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.caption || "submission"}`}
    >
      {thumbUrl ? (
        <div className={styles.imageWrap}>
          <img
            src={thumbUrl}
            alt={item.caption}
            className={styles.image}
            loading="lazy"
            decoding="async"
          />
          {embedUrl && <span className={styles.videoOverlay}>▶</span>}
        </div>
      ) : null}

      <div className={styles.cardBody}>
        <p className={styles.caption}>{item.caption}</p>
        <div className={styles.meta}>
          <span className={styles.submitter}>{item.submitterName}</span>
          {item.relatedStopId && (
            <span className={styles.stopBadge}>
              {stopNameById(item.relatedStopId)}
            </span>
          )}
          <time dateTime={item.submittedAt} className={styles.date}>
            {submittedDate}
          </time>
        </div>
      </div>
    </article>
  );
}

// ── GalleryPage ───────────────────────────────────────────────────────────────

interface GalleryPageProps {
  onClose: () => void;
}

export function GalleryPage({ onClose }: GalleryPageProps) {
  const { data, isPending, isError } = usePhotoSubmissions();
  const [selected, setSelected] = useState<PhotoSubmission | null>(null);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Community Gallery"
    >
      <div className={styles.header}>
        <h2 className={styles.title}>🦈 Community Gallery</h2>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close gallery"
        >
          ✕
        </button>
      </div>

      <div className={styles.content}>
        {isPending && <p className={styles.status}>Loading photos…</p>}
        {isError && (
          <p className={styles.status}>
            Couldn't load photos — check back soon!
          </p>
        )}
        {data && data.length === 0 && (
          <p className={styles.status}>
            No photos yet — be the first to share one! 🦈
          </p>
        )}
        {data && data.length > 0 && (
          <div className={styles.grid}>
            {data.map((item) => (
              <GalleryCard
                key={item._id}
                item={item}
                onOpen={() => setSelected(item)}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <Lightbox item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
