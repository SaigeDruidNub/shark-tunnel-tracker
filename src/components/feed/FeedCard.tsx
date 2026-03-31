import type { FeedItem } from '../../types/feedItem';
import styles from './FeedCard.module.css';

interface FeedCardProps {
  item: FeedItem;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function FeedCard({ item }: FeedCardProps) {
  return (
    <article className={styles.card}>
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt=""
          className={styles.image}
          loading="lazy"
        />
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{item.title}</h3>
        <time className={styles.date} dateTime={item.publishedAt.toISOString()}>
          {formatDate(item.publishedAt)}
        </time>
        <p className={styles.body}>{item.body}</p>
      </div>
    </article>
  );
}
