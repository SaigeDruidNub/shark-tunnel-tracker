import { useState } from "react";
import kidwindLogo from "../../assets/kidwind-favicon.png";
import { siteContent } from "../../data/siteContent";
import styles from "./Header.module.css";

const NAV_LINKS: [string, string][] = [
  ["Challenges", "https://kidwind.org/challenges/"],
  ["Training", "https://kidwind.org/training/"],
  ["Activities", "https://kidwind.org/activities/"],
  ["Shop", "https://kidwind.org/shop/"],
  ["About", "https://kidwind.org/about/"],
  ["Support Us", "https://kidwind.org/sponsors/"],
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.titleLine1}>Shark Tunnel</span>
          <span className={styles.titleLine2}>Tracker</span>
        </div>

        {/* Desktop nav */}
        <nav className={styles.kidwindNav} aria-label="KidWind navigation">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.kidwindNavLink}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className={styles.rightSlot}>
          {/* Hamburger — mobile only */}
          <button
            className={styles.hamburger}
            aria-label={menuOpen ? "Close menu" : "Open KidWind menu"}
            aria-expanded={menuOpen}
            aria-controls="kidwind-mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span
              className={`${styles.bar} ${menuOpen ? styles.barTop : ""}`}
            />
            <span
              className={`${styles.bar} ${menuOpen ? styles.barMid : ""}`}
            />
            <span
              className={`${styles.bar} ${menuOpen ? styles.barBot : ""}`}
            />
          </button>

          {/* Logo */}
          <a
            href="https://kidwind.org"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.kidwindLogoLink}
          >
            <img
              src={kidwindLogo}
              alt="KidWind.org"
              className={styles.kidwindLogo}
            />
          </a>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          id="kidwind-mobile-menu"
          className={styles.mobileMenu}
          aria-label="KidWind navigation"
        >
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      )}

      {siteContent.bannerMessage && (
        <div className={styles.banner} role="status" aria-live="polite">
          {siteContent.bannerMessage}
        </div>
      )}
    </header>
  );
}
