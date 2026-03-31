import { feedItems } from '../../data/feedItems';
import { FeedCard } from './FeedCard';
import styles from './FeedPanel.module.css';

/**
 * Scrollable aside panel listing all journey updates from feedItems.ts.
 * Renders newest-first (feedItems.ts is already sorted that way).
 * No network requests — reads purely from static data.
 */
export function FeedPanel() {
  return (
    <section className={styles.panel} aria-label="Journey updates feed">
      <header className={styles.header}>
        <div className={styles.headingRow}>
          <span className={styles.actionLabel}>Action Feed</span>
        </div>
        <p className={styles.subheading}>What&rsquo;s Happening 🦈</p>
      </header>

      {feedItems.length === 0 ? (
        <p className={styles.empty}>No updates yet — check back soon!</p>
      ) : (
        <ul className={styles.list} role="list">
          {feedItems.map((item) => (
            <li key={item.id}>
              <FeedCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
