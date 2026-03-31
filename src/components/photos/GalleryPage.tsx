import { usePhotoSubmissions } from "../../hooks/usePhotoSubmissions";
import { sanityImageUrl } from "../../lib/sanity/imageUrl";
import { stops } from "../../data/stops";
import type { PhotoSubmission } from "../../types/photoSubmission";
import styles from "./GalleryPage.module.css";

function stopNameById(id: string): string {
  const match = stops.find((s) => s.id === id);
  return match ? `${match.name}, ${match.state}` : id;
}

function GalleryCard({ item }: { item: PhotoSubmission }) {
  const imageUrl = item.image
    ? sanityImageUrl(item.image)
        .width(600)
        .height(400)
        .fit("crop")
        .format("webp")
        .url()
    : null;
  const submittedDate = new Date(item.submittedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <article className={styles.card}>
      {imageUrl && (
        <div className={styles.imageWrap}>
          <img
            src={imageUrl}
            alt={item.caption}
            className={styles.image}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      {!imageUrl && item.videoUrl && (
        <div className={styles.videoPlaceholder} aria-hidden="true">
          <span className={styles.videoIcon}>▶</span>
        </div>
      )}
      <div className={styles.cardBody}>
        <p className={styles.caption}>{item.caption}</p>
        {item.videoUrl && (
          <a
            href={item.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.videoLink}
          >
            Watch video ↗
          </a>
        )}
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

interface GalleryPageProps {
  onClose: () => void;
}

export function GalleryPage({ onClose }: GalleryPageProps) {
  const { data, isPending, isError } = usePhotoSubmissions();

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
              <GalleryCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
