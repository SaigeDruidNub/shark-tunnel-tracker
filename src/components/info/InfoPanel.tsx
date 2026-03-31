import { usePhotoSubmissions } from "../../hooks/usePhotoSubmissions";
import { sanityImageUrl } from "../../lib/sanity/imageUrl";
import { PhotoSubmissionForm } from "../photos/PhotoSubmissionForm";
import styles from "./InfoPanel.module.css";

function toYouTubeThumbnailUrl(watchUrl: string): string | null {
  try {
    const url = new URL(watchUrl);
    if (!url.hostname.includes("youtube") && !url.hostname.includes("youtu.be")) return null;
    const videoId =
      url.searchParams.get("v") ??
      url.pathname.split("/").filter(Boolean).pop() ??
      "";
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  } catch {
    return null;
  }
}

function CommunityGalleryCard({
  onViewGallery,
}: {
  onViewGallery: () => void;
}) {
  const { data, isPending } = usePhotoSubmissions();
  const previews = data?.slice(0, 2) ?? [];

  return (
    <div className={styles.cardInner}>
      <h3 className={styles.cardTitle}>Community Gallery</h3>
      <p className={styles.cardSubtitle}>
        See photos from fans, teachers, and students along the Shark Tunnel's
        journey!
      </p>

      <div className={styles.previewGrid}>
        {isPending &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.previewSkeleton} />
          ))}
        {!isPending && previews.length === 0 && (
          <p className={styles.previewEmpty}>No photos yet!</p>
        )}
        {!isPending &&
          previews.map((item) => {
            const url = item.image
              ? sanityImageUrl(item.image)
                  .width(300)
                  .height(200)
                  .fit("crop")
                  .format("webp")
                  .url()
              : item.videoUrl ? toYouTubeThumbnailUrl(item.videoUrl) : null;
            const isVideo = Boolean(item.videoUrl);
            return (
              <div key={item._id} className={styles.previewThumb}>
                {url ? (
                  <>
                    <img
                      src={url}
                      alt={item.caption}
                      className={styles.previewImg}
                      loading="lazy"
                    />
                    {isVideo && <span className={styles.previewVideoOverlay}>▶</span>}
                  </>
                ) : (
                  <div className={styles.previewVideo}>▶</div>
                )}
              </div>
            );
          })}
      </div>

      <button className={styles.outlineBtn} onClick={onViewGallery}>
        View Full Gallery
      </button>
    </div>
  );
}

function AboutCard() {
  return (
    <div className={styles.cardInner}>
      <h3 className={styles.cardTitle}>About This Event</h3>
      <p className={styles.aboutBody}>
        The Shark Wind Tunnel is traveling from Mineral Point, WI to Salina, KS
        for the <strong>Kansas KidWind State Challenge</strong> at Tony's Pizza
        Events Center.
      </p>
      <p className={styles.aboutDay}>
        <strong>Day 1:</strong> WI → IA → MO
      </p>
      <p className={styles.aboutDay}>
        <strong>Day 2:</strong> KC → Topeka → Manhattan → Salina
      </p>
      <div className={styles.aboutBtns}>
        <a
          href="https://www.kidwind.org"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.outlineBtn}
        >
          Learn More
        </a>
        <a
          href="https://kidwind.org/sponsors/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.coralBtn}
        >
          Support KidWind
        </a>
      </div>
    </div>
  );
}

interface InfoPanelProps {
  onViewGallery: () => void;
}

export function InfoPanel({ onViewGallery }: InfoPanelProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <span className={styles.label}>Info &amp; Submissions</span>
        <span className={styles.banner}>Get Involved!</span>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>
          <PhotoSubmissionForm />
        </div>
        <div className={styles.card}>
          <CommunityGalleryCard onViewGallery={onViewGallery} />
        </div>
        <div className={styles.card}>
          <AboutCard />
        </div>
      </div>
    </section>
  );
}
