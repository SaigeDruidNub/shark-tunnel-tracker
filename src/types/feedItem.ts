export interface FeedItem {
  id: string;
  title: string;
  body: string;
  /** Path relative to public/, or a resolved Sanity image URL — optional */
  imageUrl?: string;
  /** YouTube URL — optional, shown as an embed instead of a photo */
  videoUrl?: string;
  publishedAt: Date;
  /** If this update is tied to a specific stop, include its Stop.id */
  relatedStopId?: string;
}
