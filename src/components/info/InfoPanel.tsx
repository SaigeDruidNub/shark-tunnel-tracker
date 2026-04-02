import { useState } from "react";
import { usePhotoSubmissions } from "../../hooks/usePhotoSubmissions";
import { sanityImageUrl } from "../../lib/sanity/imageUrl";
import type { PhotoSubmission } from "../../types/photoSubmission";
import { FaFacebook } from "react-icons/fa";
import { Lightbox } from "../photos/Lightbox";
import { PhotoSubmissionForm } from "../photos/PhotoSubmissionForm";
import styles from "./InfoPanel.module.css";

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

function CommunityGalleryCard({
  onViewGallery,
}: {
  onViewGallery: () => void;
}) {
  const { data, isPending } = usePhotoSubmissions();
  const previews = data?.slice(0, 2) ?? [];
  const [lightboxItem, setLightboxItem] = useState<PhotoSubmission | null>(
    null,
  );

  return (
    <div className={styles.cardInner}>
      <h3 className={styles.cardTitle}>Community Gallery</h3>
      <div className={styles.cardContent}>
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
                : item.videoUrl
                  ? toYouTubeThumbnailUrl(item.videoUrl)
                  : null;
              const isVideo = Boolean(item.videoUrl);
              return (
                <button
                  key={item._id}
                  className={styles.previewThumb}
                  onClick={() => setLightboxItem(item)}
                  aria-label={`Enlarge ${item.caption}`}
                >
                  {url ? (
                    <>
                      <img
                        src={url}
                        alt={item.caption}
                        className={styles.previewImg}
                        loading="lazy"
                      />
                      {isVideo && (
                        <span className={styles.previewVideoOverlay}>▶</span>
                      )}
                    </>
                  ) : (
                    <div className={styles.previewVideo}>▶</div>
                  )}
                </button>
              );
            })}
        </div>

        <button className={styles.outlineBtn} onClick={onViewGallery}>
          View Full Gallery
        </button>
      </div>

      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </div>
  );
}

export function AboutCard() {
  return (
    <div className={styles.cardInner} style={{ height: "auto" }}>
      <h3 className={styles.cardTitle}>About This Event</h3>
      <div
        className={styles.cardContent}
        style={{ justifyContent: "flex-start" }}
      >
        <p className={styles.aboutBody}>
          The Shark Wind Tunnel is traveling from Mineral Point, WI to Salina,
          KS for the <strong>Kansas KidWind State Challenge</strong> at Tony's
          Pizza Events Center.
        </p>
        <p className={styles.aboutDay}>
          <strong>Day 1:</strong> WI → IA → MO
        </p>
        <p className={styles.aboutDay}>
          <strong>Day 2:</strong> KC → Topeka → Manhattan → Salina
        </p>
        <p className={styles.aboutBody}>
          <strong>🎉 Watch the live feed for trivia!</strong>
          <a
            href="https://www.facebook.com/share/1Dzf2SK3HX/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.triviaFbLink}
          >
            <FaFacebook />
            Follow the Event
          </a>
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
        <span className={styles.banner}>Get Involved!</span>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>
          <PhotoSubmissionForm />
        </div>
        <div className={styles.card}>
          <CommunityGalleryCard onViewGallery={onViewGallery} />
        </div>
      </div>
    </section>
  );
}
