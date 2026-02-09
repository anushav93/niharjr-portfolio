/**
 * Unsplash to Contentful Image Migration Script
 * 
 * This script:
 * 1. Fetches all collections from the configured Unsplash user
 * 2. Downloads high-resolution versions of all photos
 * 3. Uploads them to Contentful as assets
 * 4. Creates gallery collection entries in Contentful
 * 5. Outputs a manifest of all uploaded assets
 * 
 * Usage:
 *   npx ts-node scripts/migrate-images.ts
 * 
 * Required environment variables:
 *   - UNSPLASH_ACCESS_KEY
 *   - CONTENTFUL_SPACE_ID
 *   - CONTENTFUL_MANAGEMENT_TOKEN
 *   - CONTENTFUL_ENVIRONMENT (optional, defaults to 'master')
 */

import contentfulManagement from 'contentful-management';
const { createClient: createContentfulClient } = contentfulManagement;
import { createApi } from 'unsplash-js';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ============================================================================
// Configuration
// ============================================================================

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'xpIrXtl19hTth19Cl3Jq2urUKymQiTI_BtM617npZMY';
const UNSPLASH_USERNAME = process.env.UNSPLASH_USERNAME || 'niharjreddy';
const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN || process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

const TEMP_DIR = path.join(process.cwd(), '.temp-images');
const MANIFEST_PATH = path.join(process.cwd(), 'image-manifest.json');

// Concurrency limit for uploads (reduced for free tier rate limits)
const UPLOAD_CONCURRENCY = 1;

// ============================================================================
// Types
// ============================================================================

interface UnsplashPhoto {
  id: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
  };
  width: number;
  height: number;
  user: {
    name: string;
    username: string;
  };
}

interface UnsplashCollection {
  id: string;
  title: string;
  description: string | null;
  total_photos: number;
}

interface AssetManifestEntry {
  unsplashId: string;
  contentfulAssetId: string;
  title: string;
  url: string;
  width: number;
  height: number;
  collection: string;
}

interface Manifest {
  createdAt: string;
  collections: {
    [slug: string]: {
      name: string;
      contentfulEntryId?: string;
      photos: AssetManifestEntry[];
    };
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const prefix = {
    info: '📋',
    success: '✅',
    error: '❌',
    warn: '⚠️',
  };
  console.log(`${prefix[type]} ${message}`);
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          file.close();
          fs.unlinkSync(filepath);
          downloadImage(redirectUrl, filepath).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

async function pLimit<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const task of tasks) {
    const p = Promise.resolve().then(() => task()).then((result) => {
      results.push(result);
    });

    executing.push(p as Promise<void>);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((e) => e === p),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

// ============================================================================
// Unsplash API Functions
// ============================================================================

async function fetchUnsplashCollections(): Promise<UnsplashCollection[]> {
  log(`Fetching collections for user: ${UNSPLASH_USERNAME}`);
  
  const unsplash = createApi({ accessKey: UNSPLASH_ACCESS_KEY });
  
  const result = await unsplash.users.getCollections({
    username: UNSPLASH_USERNAME,
    perPage: 30,
  });

  if (result.errors) {
    throw new Error(`Unsplash API error: ${result.errors.join(', ')}`);
  }

  const collections = result.response?.results || [];
  log(`Found ${collections.length} collections`, 'success');
  
  return collections.map((c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    total_photos: c.total_photos,
  }));
}

async function fetchCollectionPhotos(collectionId: string): Promise<UnsplashPhoto[]> {
  const unsplash = createApi({ accessKey: UNSPLASH_ACCESS_KEY });
  const allPhotos: UnsplashPhoto[] = [];
  let page = 1;
  const perPage = 30;

  while (true) {
    const result = await unsplash.collections.getPhotos({
      collectionId,
      page,
      perPage,
    });

    if (result.errors) {
      throw new Error(`Unsplash API error: ${result.errors.join(', ')}`);
    }

    const photos = result.response?.results || [];
    if (photos.length === 0) break;

    allPhotos.push(
      ...photos.map((p: any) => ({
        id: p.id,
        description: p.description,
        alt_description: p.alt_description,
        urls: p.urls,
        width: p.width,
        height: p.height,
        user: {
          name: p.user.name,
          username: p.user.username,
        },
      }))
    );

    if (photos.length < perPage) break;
    page++;
  }

  return allPhotos;
}

// ============================================================================
// Contentful Functions
// ============================================================================

async function uploadToContentful(
  environment: any,
  filepath: string,
  title: string,
  description: string
): Promise<string> {
  // Read file
  const fileBuffer = fs.readFileSync(filepath);
  const fileName = path.basename(filepath);
  const contentType = 'image/jpeg';

  // Create upload
  const upload = await environment.createUpload({ file: fileBuffer });

  // Create asset
  const asset = await environment.createAsset({
    fields: {
      title: { 'en-US': title },
      description: { 'en-US': description },
      file: {
        'en-US': {
          contentType,
          fileName,
          uploadFrom: {
            sys: {
              type: 'Link',
              linkType: 'Upload',
              id: upload.sys.id,
            },
          },
        },
      },
    },
  });

  // Process and publish asset
  const processedAsset = await asset.processForAllLocales();
  
  // Wait for processing to complete
  let attempts = 0;
  while (attempts < 10) {
    const fetchedAsset = await environment.getAsset(processedAsset.sys.id);
    if (fetchedAsset.fields.file?.['en-US']?.url) {
      await fetchedAsset.publish();
      return fetchedAsset.sys.id;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    attempts++;
  }

  throw new Error('Asset processing timed out');
}

async function createGalleryCollection(
  environment: any,
  name: string,
  slug: string,
  description: string,
  photoAssetIds: string[],
  order: number
): Promise<string> {
  // Check if gallery collection content type exists
  try {
    await environment.getContentType('galleryCollection');
  } catch {
    log('Creating galleryCollection content type...', 'info');
    
    const contentType = await environment.createContentTypeWithId('galleryCollection', {
      name: 'Gallery Collection',
      displayField: 'name',
      fields: [
        { id: 'name', name: 'Name', type: 'Symbol', required: true },
        { id: 'slug', name: 'Slug', type: 'Symbol', required: true },
        { id: 'description', name: 'Description', type: 'Text', required: false },
        { 
          id: 'photos', 
          name: 'Photos', 
          type: 'Array',
          items: {
            type: 'Link',
            linkType: 'Asset',
          },
          required: false,
        },
        { id: 'order', name: 'Order', type: 'Integer', required: false },
      ],
    });
    
    await contentType.publish();
    log('Gallery collection content type created', 'success');
  }

  // Create entry
  const entry = await environment.createEntry('galleryCollection', {
    fields: {
      name: { 'en-US': name },
      slug: { 'en-US': slug },
      description: { 'en-US': description || '' },
      photos: {
        'en-US': photoAssetIds.map((id) => ({
          sys: { type: 'Link', linkType: 'Asset', id },
        })),
      },
      order: { 'en-US': order },
    },
  });

  await entry.publish();
  return entry.sys.id;
}

// ============================================================================
// Main Migration Function
// ============================================================================

async function migrate() {
  log('Starting Unsplash to Contentful migration...', 'info');

  // Validate environment
  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN) {
    log('Missing required environment variables:', 'error');
    log('  - CONTENTFUL_SPACE_ID', 'error');
    log('  - CONTENTFUL_MANAGEMENT_TOKEN', 'error');
    log('\nPlease set these in your .env.local file and try again.', 'info');
    process.exit(1);
  }

  // Initialize Contentful client
  const contentfulClient = createContentfulClient({
    accessToken: CONTENTFUL_MANAGEMENT_TOKEN,
  });

  const space = await contentfulClient.getSpace(CONTENTFUL_SPACE_ID);
  const environment = await space.getEnvironment(CONTENTFUL_ENVIRONMENT);

  log(`Connected to Contentful space: ${space.name}`, 'success');

  // Create temp directory
  ensureDir(TEMP_DIR);

  // Initialize manifest
  const manifest: Manifest = {
    createdAt: new Date().toISOString(),
    collections: {},
  };

  try {
    // Fetch collections from Unsplash
    const collections = await fetchUnsplashCollections();

    for (let i = 0; i < collections.length; i++) {
      const collection = collections[i];
      const slug = slugify(collection.title);
      
      log(`\nProcessing collection: ${collection.title} (${collection.total_photos} photos)`, 'info');

      // Fetch photos
      const photos = await fetchCollectionPhotos(collection.id);
      log(`Fetched ${photos.length} photos`, 'success');

      const uploadedAssets: AssetManifestEntry[] = [];

      // Download and upload photos
      const tasks = photos.map((photo, index) => async () => {
        const filename = `${slug}-${index + 1}-${photo.id}.jpg`;
        const filepath = path.join(TEMP_DIR, filename);

        try {
          // Download high-res image
          const downloadUrl = `${photo.urls.raw}&w=2400&q=85&fm=jpg`;
          log(`  Downloading: ${filename}`, 'info');
          await downloadImage(downloadUrl, filepath);

          // Upload to Contentful
          log(`  Uploading: ${filename}`, 'info');
          const title = photo.alt_description || photo.description || `${collection.title} - Photo ${index + 1}`;
          const description = `Photo by ${photo.user.name} (@${photo.user.username}) on Unsplash`;
          
          const assetId = await uploadToContentful(environment, filepath, title, description);

          uploadedAssets.push({
            unsplashId: photo.id,
            contentfulAssetId: assetId,
            title,
            url: photo.urls.regular,
            width: photo.width,
            height: photo.height,
            collection: slug,
          });

          log(`  ✓ Uploaded: ${filename}`, 'success');

          // Clean up temp file
          fs.unlinkSync(filepath);
        } catch (error) {
          log(`  ✗ Failed: ${filename} - ${error}`, 'error');
        }
      });

      // Process with concurrency limit
      await pLimit(tasks, UPLOAD_CONCURRENCY);

      // Create gallery collection entry
      if (uploadedAssets.length > 0) {
        log(`Creating gallery collection entry...`, 'info');
        const entryId = await createGalleryCollection(
          environment,
          collection.title,
          slug,
          collection.description || '',
          uploadedAssets.map((a) => a.contentfulAssetId),
          i + 1
        );

        manifest.collections[slug] = {
          name: collection.title,
          contentfulEntryId: entryId,
          photos: uploadedAssets,
        };

        log(`Created collection: ${collection.title} with ${uploadedAssets.length} photos`, 'success');
      }
    }

    // Save manifest
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    log(`\nManifest saved to: ${MANIFEST_PATH}`, 'success');

    // Cleanup temp directory
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmdirSync(TEMP_DIR, { recursive: true });
    }

    // Summary
    const totalPhotos = Object.values(manifest.collections).reduce(
      (sum, c) => sum + c.photos.length,
      0
    );
    log(`\n🎉 Migration complete!`, 'success');
    log(`   Collections: ${Object.keys(manifest.collections).length}`, 'info');
    log(`   Total photos: ${totalPhotos}`, 'info');

  } catch (error) {
    log(`Migration failed: ${error}`, 'error');
    throw error;
  }
}

// Run migration
migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
