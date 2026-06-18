import 'server-only';

import type { Asset, ContentfulClientApi, Entry, EntrySkeletonType, FieldsType } from 'contentful';
import type { Photo, SiteSettingsFields } from '@/types/contentful';
import { buildImageUrl } from '@/lib/images';

export { photoSrc } from '@/lib/images';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

type FieldsSkeleton<T extends FieldsType> = EntrySkeletonType<T, string>;
type ContentfulInclude = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

let client: ContentfulClientApi<undefined> | null = null;

function createContentfulClient(): ContentfulClientApi<undefined> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const contentfulPkg = require('contentful/dist/contentful.node.js') as typeof import('contentful');
  return contentfulPkg.createClient({
    space: SPACE_ID!,
    accessToken: ACCESS_TOKEN!,
    environment: ENVIRONMENT,
  });
}

export function getContentfulClient() {
  if (!SPACE_ID || !ACCESS_TOKEN) return null;
  if (!client) client = createContentfulClient();
  return client;
}

export async function getEntry<T extends FieldsType>(
  id: string,
  options: { include?: ContentfulInclude } = {}
): Promise<Entry<FieldsSkeleton<T>, undefined> | null> {
  const contentfulClient = getContentfulClient();
  if (!contentfulClient) return null;
  try {
    return await contentfulClient.getEntry<FieldsSkeleton<T>>(id, {
      include: options.include ?? 0,
    });
  } catch {
    return null;
  }
}

export async function getEntryByType<T extends FieldsType>(
  contentType: string,
  options: { include?: ContentfulInclude } = {}
): Promise<Entry<FieldsSkeleton<T>, undefined> | null> {
  const contentfulClient = getContentfulClient();
  if (!contentfulClient) return null;
  try {
    const { items } = await contentfulClient.getEntries<FieldsSkeleton<T>>({
      content_type: contentType,
      limit: 1,
      include: options.include ?? 0,
    });
    return items[0] ?? null;
  } catch {
    return null;
  }
}

export function imageUrl(
  asset: Asset | undefined | null,
  options: {
    width?: number;
    height?: number;
    format?: 'jpg' | 'png' | 'webp' | 'avif';
    quality?: number;
    fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
  } = {}
): string {
  const rawUrl = asset?.fields?.file?.url;
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  return buildImageUrl(rawUrl, options);
}

export function assetToPhoto(asset: Asset): Photo | null {
  const file = asset.fields?.file;
  if (!file?.url) return null;
  const url = typeof file.url === 'string'
    ? buildImageUrl(file.url)
    : '';
  const details = file.details as { image?: { width?: number; height?: number } } | undefined;
  return {
    id: asset.sys.id,
    url,
    width: details?.image?.width ?? 1920,
    height: details?.image?.height ?? 1080,
    title: (asset.fields.title as string) || '',
    alt: (asset.fields.description as string) || (asset.fields.title as string) || '',
  };
}

export function assetsToPhotos(assets: Asset[] | undefined): Photo[] {
  return (assets ?? []).map(assetToPhoto).filter((p): p is Photo => p !== null);
}

export async function getSiteSettingsEmail(): Promise<string | null> {
  const { CONTENTFUL_ENTRIES } = await import('@/config/contentful');
  const entry = await getEntry<SiteSettingsFields>(CONTENTFUL_ENTRIES.siteSettings);
  const email = entry?.fields?.email;
  return typeof email === 'string' ? email : null;
}
