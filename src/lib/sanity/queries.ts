import type { PhotoSubmission } from '../../types/photoSubmission';

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
