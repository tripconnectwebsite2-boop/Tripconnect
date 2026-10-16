import { createClient, type ClientConfig } from '@sanity/client';
import { apiVersion, dataset, projectId, useCdn, token } from '../env';

export const clientConfig: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
  token,
};

export const sanityClient = createClient(clientConfig);

/**
 * Client for previewing draft/scheduled content with token
 */
export const previewClient = createClient({
  ...clientConfig,
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_READ_TOKEN || token,
});
