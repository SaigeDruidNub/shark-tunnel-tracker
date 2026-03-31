export interface SiteContent {
  title: string;
  subtitle: string;
  /** Shown as a highlighted banner below the header. Set to null to hide. */
  bannerMessage: string | null;
}

/**
 * Global site copy. Update these strings and redeploy to change
 * the page title, subtitle, or live banner message.
 */
export const siteContent: SiteContent = {
  title: 'Shark Tunnel Tracker',
  subtitle: 'Follow the KidWind shark tunnel from Mineral Point, WI to Salina, KS!',
  bannerMessage: null,
  // Example live banner:
  // bannerMessage: '🦈 The shark tunnel has arrived in Salina! The Challenge starts tomorrow.',
};
