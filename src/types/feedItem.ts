export interface FeedItem {
  id: string;
  title: string;
  body: string;
  /** Path relative to public/, e.g. /images/update-1.jpg — optional */
  imageUrl?: string;
  publishedAt: Date;
  /** If this update is tied to a specific stop, include its Stop.id */
  relatedStopId?: string;
}
