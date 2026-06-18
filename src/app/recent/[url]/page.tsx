import { notFound } from 'next/navigation';
import { getContentfulClient, getEntry, assetsToPhotos, imageUrl } from '@/lib/contentful';
import { CONTENTFUL_ENTRIES } from '@/config/contentful';
import type { RecentProjectFields, SiteSettingsFields } from '@/types/contentful';
import PageHeader from '@/components/layout/PageHeader';
import PhotoGalleryClient from '@/components/gallery/PhotoGalleryClient';

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

export async function generateMetadata({ params }: { params: Promise<{ url: string }> }) {
  const { url } = await params;
  const client = getContentfulClient();
  if (!client) return { title: 'Project Not Found' };

  const { items } = await client.getEntries<RecentProjectFields>({
    content_type: 'recentProject',
    'fields.url': url,
    limit: 1,
    include: 2,
  });

  if (!items.length) return { title: 'Project Not Found' };

  const project = items[0].fields;
  const photos = assetsToPhotos(project.assets);
  const ogImage = photos[0] ? imageUrl(project.assets![0], { width: 1200, height: 630, fit: 'fill', format: 'webp' }) : undefined;

  return {
    title: `${project.title} | Recent Project`,
    description: project.title,
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  };
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
    <div className="min-h-screen bg-[#f5e9df]">
      <PageHeader
        eyebrow={settings.recentProjectEyebrow || 'Recent Project'}
        title={project.title}
      />
      <PhotoGalleryClient photos={photos} />
    </div>
  );
}
