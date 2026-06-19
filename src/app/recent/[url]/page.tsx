import { notFound } from 'next/navigation';
import { getContentfulClient, getEntry, assetsToPhotos } from '@/lib/contentful';
import { CONTENTFUL_ENTRIES } from '@/config/contentful';
import type { RecentProjectFields, SiteSettingsFields } from '@/types/contentful';
import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import PhotoGalleryClient from '@/components/gallery/PhotoGalleryClient';
import { buildPageMetadata, getSiteMetadataDefaults } from '@/lib/metadata';

export const revalidate = 60;

export async function generateStaticParams() {
  const client = getContentfulClient();
  if (!client) return [];
  const { items } = await client.getEntries<RecentProjectFields>({
    content_type: 'recentProject',
    include: 0,
  });
  return items.map((item) => ({ url: item.fields.url }));
}

export async function generateMetadata({ params }: { params: Promise<{ url: string }> }): Promise<Metadata> {
  const { url } = await params;
  const client = getContentfulClient();
  const defaults = await getSiteMetadataDefaults();

  if (!client) {
    return buildPageMetadata({ title: 'Project Not Found', description: defaults.siteDescription, path: `/recent/${url}` });
  }

  const { items } = await client.getEntries<RecentProjectFields>({
    content_type: 'recentProject',
    'fields.url': url,
    limit: 1,
    include: 0,
  });

  if (!items.length) {
    return buildPageMetadata({ title: 'Project Not Found', description: defaults.siteDescription, path: `/recent/${url}` });
  }

  const project = items[0].fields;

  return buildPageMetadata({
    title: project.title,
    description: `View photos from ${project.title}, a recent project by ${defaults.siteTitle}.`,
    path: `/recent/${url}`,
  });
}

export default async function RecentProjectPage({
  params,
}: {
  params: Promise<{ url: string }>;
}) {
  const { url } = await params;
  const client = getContentfulClient();
  if (!client) notFound();

  const [{ items }, settingsEntry] = await Promise.all([
    client.getEntries<RecentProjectFields>({
      content_type: 'recentProject',
      'fields.url': url,
      limit: 1,
      include: 2,
    }),
    getEntry<SiteSettingsFields>(CONTENTFUL_ENTRIES.siteSettings),
  ]);

  if (!items.length || !settingsEntry) notFound();

  const project = items[0].fields;
  const photos = assetsToPhotos(project.assets);
  const settings = settingsEntry.fields;

  return (
    <div className="min-h-screen bg-page">
      <PageHeader
        eyebrow={settings.recentProjectEyebrow || 'Recent Project'}
        title={project.title}
      />
      <PhotoGalleryClient photos={photos} />
    </div>
  );
}
