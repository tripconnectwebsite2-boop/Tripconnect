import createImageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';
import { dataset, projectId } from '../env';

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || 'production',
});

/**
 * Build optimized Sanity image URL with focal point and crop
 */
export const urlForImage = (source: any) => {
  if (!source) return null;
  // If source is already a string URL (e.g. from local assets or Unsplash), return as is
  if (typeof source === 'string') {
    return source;
  }
  // If object has direct image url (e.g. from fallback object)
  if (source.asset?._ref || source._ref || source.asset?.url) {
    return imageBuilder.image(source).auto('format').fit('max');
  }
  if (typeof source.url === 'string') {
    return source.url;
  }
  return null;
};
