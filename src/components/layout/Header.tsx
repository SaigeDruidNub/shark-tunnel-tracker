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
          <span className={styles.titleLine1}>Shark Tunnel</span>
          <span className={styles.titleLine2}>Tracker</span>
        </div>
        <a
          href="https://kidwind.org"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.kidwindLink}
        >
          KidWind.org
        </a>
      </div>

      {siteContent.bannerMessage && (
        <div className={styles.banner} role="status" aria-live="polite">
          {siteContent.bannerMessage}
        </div>
      )}
    </header>
  );
}
