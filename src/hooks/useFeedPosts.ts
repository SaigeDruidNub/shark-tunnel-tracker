import { useQuery } from "@tanstack/react-query";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { readClient } from "../lib/sanity/client";
import { FEED_POSTS_QUERY, type SanityFeedPost } from "../lib/sanity/queries";
import { sanityImageUrl } from "../lib/sanity/imageUrl";
import type { FeedItem } from "../types/feedItem";

const REFETCH_INTERVAL_MS = 60_000;

function toEmbedUrl(url: string): string {
  // Convert any YouTube watch/short URL to an embed URL
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;
  } catch {
    // fall through
  }
  return url;
}

function toFeedItem(post: SanityFeedPost): FeedItem {
  return {
    id: post._id,
    title: post.title,
    body: post.body,
    imageUrl: post.image
      ? sanityImageUrl(post.image as SanityImageSource)
          .width(800)
          .format("webp")
          .url()
      : undefined,
    videoUrl: post.videoUrl ? toEmbedUrl(post.videoUrl) : undefined,
    publishedAt: new Date(post.publishedAt),
    relatedStopId: post.relatedStopId,
  };
}

/**
 * Fetches feed posts from Sanity, sorted newest-first.
 * Polls every 60 seconds so posts added in the studio appear without a page reload.
 */
export function useFeedPosts(): FeedItem[] {
  const { data: sanityPosts = [] } = useQuery<SanityFeedPost[]>({
    queryKey: ["feedPosts"],
    queryFn: () => readClient.fetch<SanityFeedPost[]>(FEED_POSTS_QUERY),
    refetchInterval: REFETCH_INTERVAL_MS,
    staleTime: REFETCH_INTERVAL_MS,
  });

  return sanityPosts.map(toFeedItem);
}
