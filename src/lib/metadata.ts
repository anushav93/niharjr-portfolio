import { cache } from 'react';
import type { Metadata } from 'next';
import { getEntry, imageUrl } from '@/lib/contentful';
import { CONTENTFUL_ENTRIES } from '@/config/contentful';
import type { SiteSettingsFields } from '@/types/contentful';

type SiteMetadataDefaults = {
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  ogImage?: string;
};

export const getSiteMetadataDefaults = cache(async (): Promise<SiteMetadataDefaults> => {
  const entry = await getEntry<SiteSettingsFields>(CONTENTFUL_ENTRIES.siteSettings, { include: 1 });
  const fields = entry?.fields;

  return {
    siteTitle: fields?.siteTitle || 'Nihar J Reddy Photography',
    siteDescription: fields?.siteDescription || '',
    siteUrl: fields?.siteUrl || 'https://www.negativereel.com',
    ogImage: fields?.defaultImage
      ? imageUrl(fields.defaultImage, { width: 1200, height: 630, fit: 'fill', format: 'webp' })
      : undefined,
  };
});

type BuildPageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  /** Homepage: use site title without the `%s | site` template suffix */
  absoluteTitle?: boolean;
};

export async function buildPageMetadata({
  title,
  description,
  path = '',
  absoluteTitle = false,
}: BuildPageMetadataOptions): Promise<Metadata> {
  const { siteTitle, siteDescription, siteUrl, ogImage } = await getSiteMetadataDefaults();
  const resolvedDescription = description.trim() || siteDescription;
  const fullTitle = absoluteTitle ? title : `${title} | ${siteTitle}`;

  const baseUrl = siteUrl.replace(/\/$/, '');
  const pageUrl = path ? `${baseUrl}${path.startsWith('/') ? path : `/${path}`}` : baseUrl;

  const ogImages = ogImage
    ? [{ url: ogImage, width: 1200, height: 630, alt: siteTitle }]
    : undefined;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: resolvedDescription,
    openGraph: {
      title: fullTitle,
      description: resolvedDescription,
      url: pageUrl,
      locale: 'en_US',
      type: 'website',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: resolvedDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export function truncateDescription(text: string, maxLength = 160): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1).trimEnd()}…`;
}
