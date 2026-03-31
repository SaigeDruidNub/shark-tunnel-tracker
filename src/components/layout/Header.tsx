import { siteContent } from '../../data/siteContent';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header} role="banner">
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <div className={styles.inner}>
        <div className={styles.brand}>
          {/* KidWind logo style: "Kid" bold purple, "Wind" brand purple */}
          <span className={styles.logoKid}>Kid</span>
          <span className={styles.logoWind}>Wind</span>
          <span className={styles.logoSeparator} aria-hidden="true"> · </span>
          <span className={styles.appName}>{siteContent.title}</span>
        </div>
      </div>

      {siteContent.bannerMessage && (
        <div className={styles.banner} role="status" aria-live="polite">
          {siteContent.bannerMessage}
        </div>
      )}
    </header>
  );
}
