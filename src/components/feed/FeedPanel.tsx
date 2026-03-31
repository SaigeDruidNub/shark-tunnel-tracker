import { feedItems } from '../../data/feedItems';
import { useAppContext } from '../../context/AppContext';
import { FeedCard } from './FeedCard';
import styles from './FeedPanel.module.css';

/**
 * Scrollable aside panel listing journey updates from feedItems.ts.
 * Only shows items whose publishedAt is at or before the current time
 * (or the debug time override), newest-first.
 */
export function FeedPanel() {
  const { state } = useAppContext();
  const now = state.debugNow ?? new Date();

  const visibleItems = feedItems.filter(
    (item) => item.publishedAt.getTime() <= now.getTime(),
  );

  return (
    <section className={styles.panel} aria-label="Journey updates feed">
      <header className={styles.header}>
        <div className={styles.headingRow}>
          <span className={styles.actionLabel}>Action Feed</span>
        </div>
        <p className={styles.subheading}>What&rsquo;s Happening 🦈</p>
      </header>

      {visibleItems.length === 0 ? (
        <p className={styles.empty}>No updates yet — check back soon!</p>
      ) : (
        <ul className={styles.list} role="list">
          {visibleItems.map((item) => (
            <li key={item.id}>
              <FeedCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
