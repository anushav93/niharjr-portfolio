import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getContentfulClient, getEntry, assetsToPhotos } from '@/lib/contentful';
import { CONTENTFUL_ENTRIES } from '@/config/contentful';
import type { GalleryCollectionFields, GalleryPageFields } from '@/types/contentful';
import PageHeader from '@/components/layout/PageHeader';
import PhotoGalleryClient from '@/components/gallery/PhotoGalleryClient';
import type { GalleryFilter } from '@/components/gallery/FilterBar';
import BackToTop from '@/components/layout/BackToTop';
import { buildPageMetadata, getSiteMetadataDefaults, truncateDescription } from '@/lib/metadata';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [pageEntry, defaults] = await Promise.all([
    getEntry<GalleryPageFields>(CONTENTFUL_ENTRIES.galleryPage),
    getSiteMetadataDefaults(),
  ]);

  const page = pageEntry?.fields;

  return buildPageMetadata({
    title: page?.pageTitle || 'Gallery',
    description: truncateDescription(
      page?.pageSubtitle ||
        `Browse the photography portfolio of ${defaults.siteTitle}.`
    ),
    path: '/gallery',
  });
}

type Collection = {
  id: string;
  slug: string;
  name: string;
  photos: ReturnType<typeof assetsToPhotos>;
};
type PageProps ={
  searchParams: Promise<{ filter?: string }>;
}

export default async function GalleryPage({
  searchParams,
}:PageProps) {

  const client = getContentfulClient();
  if (!client) notFound();

  const [pageEntry, collectionsResult, resolvedSearchParams] = await Promise.all([
    getEntry<GalleryPageFields>(CONTENTFUL_ENTRIES.galleryPage),
    client.getEntries<GalleryCollectionFields>({
      content_type: 'galleryCollection',
      order: ['fields.order'] as ['fields.order'],
      include: 2,
    }),
    searchParams,
  ]);



  if (!pageEntry) notFound();

  const page = pageEntry.fields;

  const seenSlugs = new Set<string>();
  const collections: Collection[] = [];

  for (const entry of collectionsResult.items) {
    const slug = entry.fields.slug;
    if (!slug || seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    collections.push({
      id: entry.sys.id,
      slug,
      name: entry.fields.name,
      photos: assetsToPhotos(entry.fields.photos),
    });
  }
  

  const filters: GalleryFilter[] = [
    { id: 'ALL', label: 'All Work', value: 'ALL' },
    ...collections.map((c) => ({ id: c.id, label: c.name, value: c.slug })),
  ];

 

  const filterValues = filters.map((f) => f.value);
  const active =
    resolvedSearchParams?.filter && filterValues.includes(resolvedSearchParams.filter)
      ? resolvedSearchParams.filter
      : 'ALL';

      
  const photos =
    active === 'ALL'
      ? collections.flatMap((c) => c.photos)
      : collections.find((c) => c.slug === active)?.photos ?? [];
 
  return (
    <div className="min-h-screen bg-page">
      <PageHeader
        eyebrow={page.pageEyebrow!}
        title={page.pageTitle}
        subtitle={page.pageSubtitle}
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
          </div>
        }
      >
        <PhotoGalleryClient filters={filters} initialActive={active} photos={photos} />
      </Suspense>
      <BackToTop />
    </div>
  );
}
