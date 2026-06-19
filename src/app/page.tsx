import { notFound } from 'next/navigation';
import { getEntry, photoSrc, assetsToPhotos } from '@/lib/contentful';
import { CONTENTFUL_ENTRIES } from '@/config/contentful';
import type { HomepageFields, RecentProjectFields } from '@/types/contentful';
import type { Entry } from 'contentful';
import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import CornerFrameButton from '@/components/CornerFrameButton';
import { buildPageMetadata, getSiteMetadataDefaults, truncateDescription } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const [entry, defaults] = await Promise.all([
    getEntry<HomepageFields>(CONTENTFUL_ENTRIES.homepage, { include: 1 }),
    getSiteMetadataDefaults(),
  ]);

  if (!entry) {
    return buildPageMetadata({
      title: defaults.siteTitle,
      description: defaults.siteDescription,
      path: '/',
      absoluteTitle: true,
    });
  }

  const fields = entry.fields;
  return buildPageMetadata({
    title: defaults.siteTitle,
    description: truncateDescription(fields.description || defaults.siteDescription),
    path: '/',
    absoluteTitle: true,
  });
}

function getRandomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)]; 
}

export default async function HomePage() {
  const entry = await getEntry<HomepageFields>(CONTENTFUL_ENTRIES.homepage, { include: 3 });
  if (!entry) notFound();

  const fields = entry.fields;
  const recentProjects = (fields.recentProjects ?? []) as Entry<RecentProjectFields>[];

  const projectsForDisplay = recentProjects
    .map((project) => {
      const projectFields = project.fields;
      const photos = assetsToPhotos(projectFields.assets);
      if (photos.length === 0) return null;
      const randomPhoto = getRandomItem(photos)!;
      return {
        src: photoSrc(randomPhoto, 800, 90),
        alt: randomPhoto.alt,
        title: projectFields.title,
        href: `/recent/${projectFields.url}`,
      };
    })
    .filter(Boolean) as { src: string; alt: string; title: string; href: string }[];

  return (
    <div className="min-h-screen bg-page">
      <HeroSection
        tagline={fields.tagline}
        title={fields.title}
        description={fields.description || ''}
      />

      {fields.recentSectionTitle && projectsForDisplay.length > 0 && (
        <FeaturedSection
          sectionTitle={fields.recentSectionTitle}
          projects={projectsForDisplay}
        />
      )}

      {fields.galleryCtaText && (
        <div className="text-center pb-32 px-6">
          <CornerFrameButton href="/gallery" variant="primary">{fields.galleryCtaText}</CornerFrameButton>
        </div>
      )}
    </div>
  );
}
