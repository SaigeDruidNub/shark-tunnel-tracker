import { useState } from "react";
import kidwindLogo from "../../assets/kidwind-favicon.png";
import { siteContent } from "../../data/siteContent";
import styles from "./Header.module.css";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Challenges",
    href: "https://kidwind.org/challenges/",
    children: [
      {
        label: "KidWind Challenge",
        href: "https://kidwind.org/events/in-person-challenge/",
      },
      {
        label: "Online Wind Challenge",
        href: "https://kidwind.org/online-challenge/online-wind-turbine-challenge/",
      },
      {
        label: "Online Solar Challenge",
        href: "https://kidwind.org/online-challenge/online-solar-home-challenge/",
      },
      {
        label: "Simulation Challenge",
        href: "https://kidwind.org/simulation-challenge/",
      },
      { label: "Art Challenge", href: "https://kidwind.org/art-challenge/" },
      { label: "KidWind Worlds", href: "https://kidwind.org/worlds/" },
      {
        label: "Organizer Resources",
        href: "https://kidwind.org/organizer-resources/",
      },
    ],
  },
  {
    label: "Training",
    href: "https://kidwind.org/training/",
    children: [
      { label: "Workshops", href: "https://kidwind.org/events/workshops/" },
      { label: "Webinars", href: "https://kidwind.org/events/webinars/" },
      {
        label: "REcharge Academy",
        href: "https://kidwind.org/recharge-academy/",
      },
    ],
  },
  { label: "Activities", href: "https://kidwind.org/activities/" },
  { label: "Shop", href: "https://kidwind.org/shop/" },
  {
    label: "About",
    href: "https://kidwind.org/about/",
    children: [
      { label: "Who We Are", href: "https://kidwind.org/about/" },
      { label: "News", href: "https://kidwind.org/news/" },
      { label: "Contact", href: "https://kidwind.org/contact/" },
      { label: "Jobs", href: "https://kidwind.org/jobs/" },
      { label: "Dashboard", href: "https://kidwind.org/kidwind-dashboard/" },
    ],
  },
  {
    label: "Support Us",
    href: "https://kidwind.org/sponsors/",
    children: [
      {
        label: "Sponsor a Challenge",
        href: "https://kidwind.org/sponsors/#challenges",
      },
      {
        label: "Send a Teacher",
        href: "https://kidwind.org/sponsors/#teacher-training",
      },
      {
        label: "Help Worlds Happen",
        href: "https://kidwind.org/sponsors/#worlds",
      },
    ],
  },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpenItem, setMobileOpenItem] = useState<string | null>(null);

  function toggleMobileItem(label: string) {
    setMobileOpenItem((prev) => (prev === label ? null : label));
  }

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.titleLine1}>Shark Tunnel</span>
          <span className={styles.titleLine2}>Tracker</span>
        </div>

        {/* Desktop nav */}
        <nav className={styles.kidwindNav} aria-label="KidWind navigation">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.label} className={styles.navItem}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.kidwindNavLink}
                >
                  {item.label} <span className={styles.caret}>▾</span>
                </a>
                <div className={styles.dropdown}>
                  {item.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.dropdownLink}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.kidwindNavLink}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className={styles.rightSlot}>
          {/* Hamburger — mobile only */}
          <button
            className={styles.hamburger}
            aria-label={menuOpen ? "Close menu" : "Open KidWind menu"}
            aria-expanded={menuOpen}
            aria-controls="kidwind-mobile-menu"
            onClick={() => {
              setMenuOpen((o) => !o);
              setMobileOpenItem(null);
            }}
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
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.label}>
                <button
                  className={styles.mobileNavToggle}
                  aria-expanded={mobileOpenItem === item.label}
                  onClick={() => toggleMobileItem(item.label)}
                >
                  {item.label}
                  <span
                    className={`${styles.mobileCaret} ${
                      mobileOpenItem === item.label
                        ? styles.mobileCaretOpen
                        : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>
                {mobileOpenItem === item.label && (
                  <div className={styles.mobileSubMenu}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.mobileSubLink}
                      onClick={() => setMenuOpen(false)}
                    >
                      All {item.label}
                    </a>
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.mobileSubLink}
                        onClick={() => setMenuOpen(false)}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ),
          )}
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
