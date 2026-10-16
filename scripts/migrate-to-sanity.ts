/**
 * Programmatic Sanity Migration Runner
 * If SANITY_API_WRITE_TOKEN / SANITY_API_TOKEN is provided in .env.local,
 * this pushes all 40+ documents directly into your Sanity dataset via transactions!
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

async function runDirectMigration() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

  if (!projectId || projectId === 'your-project-id' || !token) {
    console.log('[Sanity Migration] Direct API push skipped (NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN not yet in .env.local).');
    console.log('[Sanity Migration] You can import using the generated dataset: npx sanity dataset import sanity-migration-dataset.ndjson production');
    return;
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-03-01',
    token,
    useCdn: false,
  });

  const ndjsonPath = path.join(process.cwd(), 'sanity-migration-dataset.ndjson');
  if (!fs.existsSync(ndjsonPath)) {
    console.error('sanity-migration-dataset.ndjson does not exist. Run export first.');
    return;
  }

  const lines = fs.readFileSync(ndjsonPath, 'utf-8').split('\n').filter(Boolean);
  console.log(`[Sanity Migration] Starting upload of ${lines.length} documents to ${projectId}:${dataset}...`);

  let count = 0;
  for (const line of lines) {
    const doc = JSON.parse(line);
    try {
      await client.createOrReplace(doc);
      count++;
    } catch (err: any) {
      console.error(`Failed to upload ${doc._id}:`, err.message);
    }
  }

  console.log(`[Sanity Migration] SUCCESS! Uploaded ${count}/${lines.length} documents into Sanity.`);
}

runDirectMigration().catch(console.error);
