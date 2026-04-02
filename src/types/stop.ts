export interface Stop {
  id: string;
  order: number;
  name: string;
  city: string;
  state: string;
  description: string;
  /** YouTube watch URL, e.g. https://www.youtube.com/watch?v=... */
  videoUrl?: string;
  /** X position within the SVG viewBox */
  svgX: number;
  /** Y position within the SVG viewBox */
  svgY: number;
  /** When true, the stop is excluded from the map but still appears in dropdowns */
  hideFromMap?: boolean;
}

/** Derived state — computed at runtime, not stored */
export type StopStatus = 'locked' | 'unlocked' | 'active';
