'use client';

/**
 * Sanity Studio Configuration
 * Embedded inside Next.js App Router at /studio
 */

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schema } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'Trip Connect Studio',
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
