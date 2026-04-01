import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { readClient } from "./client";

const builder = imageUrlBuilder(readClient);

/**
 * Returns a Sanity image URL builder pre-configured for the project.
 *
 * Usage:
 *   sanityImageUrl(submission.image).width(400).format('webp').url()
 */
export function sanityImageUrl(source: SanityImageSource) {
  return builder.image(source);
}
