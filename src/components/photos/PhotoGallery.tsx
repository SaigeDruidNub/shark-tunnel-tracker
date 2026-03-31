import { usePhotoSubmissions } from '../../hooks/usePhotoSubmissions'
import { sanityImageUrl } from '../../lib/sanity/imageUrl'
import { stops } from '../../data/stops'
import type { PhotoSubmission } from '../../types/photoSubmission'
import styles from './PhotoGallery.module.css'

function stopNameById(id: string): string {
  const match = stops.find((s) => s.id === id)
  return match ? `${match.name}, ${match.state}` : id
}

function toYouTubeThumbnailUrl(watchUrl: string): string | null {
  try {
    const url = new URL(watchUrl)
    if (!url.hostname.includes('youtube') && !url.hostname.includes('youtu.be')) return null
    const videoId =
      url.searchParams.get('v') ??
      url.pathname.split('/').filter(Boolean).pop() ??
      ''
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
  } catch {
    return null
  }
}

function SubmissionCard({ item }: { item: PhotoSubmission }) {
  const hasImage = Boolean(item.image)
  const hasVideo = Boolean(item.videoUrl)

  const imageUrl = hasImage
    ? sanityImageUrl(item.image!).width(600).height(400).fit('crop').format('webp').url()
    : hasVideo ? toYouTubeThumbnailUrl(item.videoUrl!) : null

  const submittedDate = new Date(item.submittedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className={styles.card}>
      {imageUrl && (
        <div className={styles.imageWrap}>
          <img
            src={imageUrl}
            alt={item.caption}
            className={styles.image}
            width={600}
            height={400}
            loading="lazy"
            decoding="async"
          />
          {hasVideo && <span className={styles.videoOverlay}>▶</span>}
        </div>
      )}

      <div className={styles.cardBody}>
        <p className={styles.caption}>{item.caption}</p>

        {hasVideo && (
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
  )
}

export function PhotoGallery() {
  const { data, isPending, isError, error } = usePhotoSubmissions()

  if (isPending) {
    return (
      <section className={styles.section} aria-label="Community photos">
        <h3 className={styles.heading}>Community Photos</h3>
        <div className={styles.skeletonGrid} aria-busy="true" aria-label="Loading photos">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    if (import.meta.env.DEV) {
      console.error('[PhotoGallery] fetch failed:', error)
    }
    return (
      <section className={styles.section} aria-label="Community photos">
        <h3 className={styles.heading}>Community Photos</h3>
        <p className={styles.empty}>Couldn't load photos right now — check back soon!</p>
      </section>
    )
  }

  if (!data || data.length === 0) {
    return (
      <section className={styles.section} aria-label="Community photos">
        <h3 className={styles.heading}>Community Photos</h3>
        <p className={styles.empty}>
          No photos yet — be the first to share one! 🦈
        </p>
      </section>
    )
  }

  return (
    <section className={styles.section} aria-label="Community photos">
      <h3 className={styles.heading}>Community Photos</h3>
      <div className={styles.grid}>
        {data.map((item) => (
          <SubmissionCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  )
}
