import type { PhotoSubmission } from "../../types/photoSubmission";

/**
 * Fetches all approved photo/video submissions, newest first.
 * Only the fields needed for display are projected to keep payloads small.
 */
export const APPROVED_SUBMISSIONS_QUERY = `
  *[_type == "photoSubmission" && approved == true] | order(submittedAt desc) {
    _id,
    caption,
    submitterName,
    submittedAt,
    videoUrl,
    image,
    relatedStopId
  }
` as const;

/** Type alias so callers don't need to import from types directly */
export type { PhotoSubmission };

/**
 * Fetches the stop recap for a single stop by its fixed document ID.
 * Document IDs follow the pattern `stopRecap-{stopId}`.
 */
export const STOP_RECAP_QUERY = `
  *[_type == "stopRecap" && _id == $docId][0] {
    blurb,
    videoUrl
  }
` as const;

export interface StopRecap {
  blurb?: string;
  videoUrl?: string;
}

/**
 * Fetches the most recently updated truck status document.
 * Only one such document should exist in the dataset.
 */
export const TRUCK_STATUS_QUERY = `
  *[_type == "truckStatus"] | order(_updatedAt desc) [0] {
    message,
    showBubble
  }
` as const;

export interface TruckStatus {
  message: string;
  showBubble: boolean;
}

/**
 * Fetches all feed posts from Sanity, newest first.
 */
export const FEED_POSTS_QUERY = `
  *[_type == "feedPost"] | order(publishedAt desc) {
    _id,
    title,
    body,
    image,
    videoUrl,
    facebookUrl,
    instagramUrl,
    publishedAt,
    relatedStopId
  }
` as const;

export interface SanityFeedPost {
  _id: string;
  title: string;
  body: string;
  image?: unknown;
  videoUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  publishedAt: string;
  relatedStopId?: string;
}
