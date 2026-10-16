export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-01';

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id';

export const useCdn = process.env.NODE_ENV === 'production';

export const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;

/**
 * Checks whether valid Sanity environment variables are provided
 */
export function isSanityConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'your-project-id'
  );
}
