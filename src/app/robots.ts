import type { MetadataRoute } from 'next';
import { getSiteMetadataDefaults } from '@/lib/metadata';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { siteUrl } = await getSiteMetadataDefaults();
  const baseUrl = siteUrl.replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
