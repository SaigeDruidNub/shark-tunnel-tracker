import { useState } from "react";
import {
  FaBolt,
  FaHammer,
  FaMedal,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import { GiTrophy } from "react-icons/gi";
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

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.titleLine1}>Shark Tunnel</span>
          <span className={styles.titleLine2}>Tracker</span>
        </div>

        <div className={styles.navGroup}>
          {/* Desktop nav — all items except Support Us */}
          <nav className={styles.kidwindNav} aria-label="KidWind navigation">
            {NAV_ITEMS.filter((item) => item.label !== "Support Us").map(
              (item) =>
                item.children ? (
                  <div key={item.label} className={styles.navItem}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.kidwindNavLink}
                    >
                      {item.label} <span className={styles.caret}>&#8964;</span>
                    </a>
                    <div className={styles.dropdown}>
                      <div className={styles.dropdownInner}>
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
            {/* Cart + Dashboard icons — desktop only */}
            <a
              href="https://kidwind.org/shop/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconLink}
              aria-label="KidWind Shop"
            >
              <FaShoppingCart />
            </a>
            <a
              href="https://kidwind.org/kidwind-dashboard/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconLink}
              aria-label="KidWind Dashboard"
            >
              <FaUser />
            </a>

            {/* Support Us button — desktop only */}
            <a
              href="https://kidwind.org/sponsors/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.supportBtn}
            >
              Support Us
            </a>

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
        {/* end navGroup */}
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          id="kidwind-mobile-menu"
          className={styles.mobileMenu}
          aria-label="KidWind navigation"
        >
          {/* 2×2 feature grid */}
          <div className={styles.mobileGrid}>
            {(
              [
                [
                  <FaMedal />,
                  "KidWind Challenges",
                  "https://kidwind.org/challenges/",
                ],
                [
                  <FaHammer />,
                  "Teacher Trainings",
                  "https://kidwind.org/training/",
                ],
                [
                  <GiTrophy />,
                  "Classroom Activities",
                  "https://kidwind.org/activities/",
                ],
                [<FaBolt />, "About KidWind", "https://kidwind.org/about/"],
              ] as [React.ReactNode, string, string][]
            ).map(([icon, label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileGridCard}
                onClick={() => setMenuOpen(false)}
              >
                <span className={styles.mobileGridIcon}>{icon}</span>
                <span>{label}</span>
              </a>
            ))}
          </div>

          {/* Shop CTA */}
          <a
            href="https://kidwind.org/shop/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileShopBtn}
            onClick={() => setMenuOpen(false)}
          >
            Get KidWind Gear
          </a>

          {/* Secondary links */}
          <div className={styles.mobileSecondaryLinks}>
            {(
              [
                ["KidWind Dashboard", "https://kidwind.org/kidwind-dashboard/"],
                ["Who We Are", "https://kidwind.org/about/"],
                ["News", "https://kidwind.org/news/"],
                ["Contact Form", "https://kidwind.org/contact/"],
                ["Jobs", "https://kidwind.org/jobs/"],
                ["Support Us", "https://kidwind.org/sponsors/"],
              ] as [string, string][]
            ).map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileSecondaryLink}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
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
