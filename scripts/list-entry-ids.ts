/**
 * List singleton Contentful entry IDs for src/config/contentful.ts
 * Usage: npx ts-node --esm scripts/list-entry-ids.ts
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from 'contentful';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const ENV = process.env.CONTENTFUL_ENVIRONMENT || 'master';

const SINGLETON_TYPES = [
  'homepage',
  'aboutPage',
  'siteSettings',
  'galleryPage',
  'contactPage',
] as const;

async function main() {
  if (!SPACE_ID || !TOKEN) {
    console.error('Missing CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN');
    process.exit(1);
  }

  const client = createClient({ space: SPACE_ID, accessToken: TOKEN, environment: ENV });

  console.log('export const CONTENTFUL_ENTRIES = {');
  for (const contentType of SINGLETON_TYPES) {
    const { items } = await client.getEntries({ content_type: contentType, limit: 1 });
    const id = items[0]?.sys?.id ?? 'MISSING';
    console.log(`  ${contentType}: '${id}',`);
  }
  console.log('} as const;');
}

main().catch(console.error);
