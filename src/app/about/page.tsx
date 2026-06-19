import { notFound } from 'next/navigation';
import { getEntry } from '@/lib/contentful';
import { CONTENTFUL_ENTRIES } from '@/config/contentful';
import type { AboutPageFields } from '@/types/contentful';
import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import AboutStory from '@/components/about/AboutStory';
import AboutApproach from '@/components/about/AboutApproach';
import AboutCTA from '@/components/about/AboutCTA';
import { buildPageMetadata, getSiteMetadataDefaults, truncateDescription } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const [entry, defaults] = await Promise.all([
    getEntry<AboutPageFields>(CONTENTFUL_ENTRIES.aboutPage, { include: 1 }),
    getSiteMetadataDefaults(),
  ]);

  if (!entry) {
    return buildPageMetadata({ title: 'About', description: defaults.siteDescription, path: '/about' });
  }

  const fields = entry.fields;
  const description =
    fields.heroSubtitle ||
    fields.storyParagraphs?.[0] ||
    fields.approachDescription ||
    defaults.siteDescription;

  return buildPageMetadata({
    title: fields.heroTitle || 'About',
    description: truncateDescription(description),
    path: '/about',
  });
}

export default async function AboutPage() {
  const entry = await getEntry<AboutPageFields>(CONTENTFUL_ENTRIES.aboutPage, { include: 1 });
  if (!entry) notFound();

  const fields = entry.fields;

  return (
    <div className="min-h-screen bg-page">
      <PageHeader
        eyebrow={fields.pageEyebrow || 'About'}
        title={fields.heroTitle}
        subtitle={fields.heroSubtitle}
      />
      <AboutStory fields={fields} />
      <AboutApproach
        title={fields.approachTitle}
        description={fields.approachDescription}
        principles={fields.principles}
      />
      <AboutCTA
        title={fields.ctaTitle}
        description={fields.ctaDescription}
        primaryButtonText={fields.primaryButtonText}
        secondaryButtonText={fields.secondaryButtonText}
      />
    </div>
  );
}
