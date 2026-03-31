/** Shape returned by the Sanity GROQ query for approved submissions */
export interface PhotoSubmission {
  _id: string;
  caption: string;
  submitterName: string;
  submittedAt: string; // ISO 8601 string from Sanity
  /** YouTube URL — optional, mutually exclusive with image */
  videoUrl?: string;
  /** Sanity image reference — present when submission is a photo */
  image?: SanityImageRef;
  /** Matches a Stop.id from static data */
  relatedStopId?: string;
}

export interface SanityImageRef {
  asset: {
    _ref: string;
    _type: 'reference';
  };
}
