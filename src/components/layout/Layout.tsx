import type { ReactNode } from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
  map: ReactNode;
  feed: ReactNode;
}

/**
 * Two-column layout on desktop (map | feed), stacked single-column on mobile.
 * The map panel fills remaining space; the feed panel has a fixed min-width.
 */
export function Layout({ map, feed }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <main id="main-content" className={styles.mapPanel} tabIndex={-1}>
        {map}
      </main>
      <aside className={styles.feedPanel} aria-label="Live updates feed">
        {feed}
      </aside>
    </div>
  );
}
