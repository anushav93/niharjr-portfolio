import type { MetadataRoute } from 'next';
import { getContentfulClient } from '@/lib/contentful';
import { getSiteMetadataDefaults } from '@/lib/metadata';
import type { RecentProjectFields } from '@/types/contentful';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = await getSiteMetadataDefaults();
  const baseUrl = siteUrl.replace(/\/$/, '');

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/gallery`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ];

  const client = getContentfulClient();
  if (!client) return staticPages;

  const { items } = await client.getEntries<RecentProjectFields>({
    content_type: 'recentProject',
    include: 0,
  });

  const projectPages: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${baseUrl}/recent/${item.fields.url}`,
    lastModified: item.sys.updatedAt ? new Date(item.sys.updatedAt) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages];
}
