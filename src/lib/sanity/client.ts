import { createClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string;
const dataset = import.meta.env.VITE_SANITY_DATASET as string;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION as string;

/**
 * Read-only client — uses the Sanity CDN, no auth token required.
 * Used by usePhotoSubmissions to fetch approved submissions.
 */
export const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Write client — uses a scoped API token that can only create photoSubmission documents.
 * Used by PhotoSubmissionForm to upload assets and create submission documents.
 * The token is public-facing but scoped to minimize exposure.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN as string,
});
