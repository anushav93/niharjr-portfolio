import { notFound } from 'next/navigation';
import { getEntry } from '@/lib/contentful';
import { CONTENTFUL_ENTRIES } from '@/config/contentful';
import type { AboutPageFields } from '@/types/contentful';
import PageHeader from '@/components/layout/PageHeader';
import AboutStory from '@/components/about/AboutStory';
import AboutApproach from '@/components/about/AboutApproach';
import AboutCTA from '@/components/about/AboutCTA';

export const revalidate = 60;

export default async function AboutPage() {
  const entry = await getEntry<AboutPageFields>(CONTENTFUL_ENTRIES.aboutPage, { include: 1 });
  if (!entry) notFound();

  const fields = entry.fields;

  return (
    <div className="min-h-screen bg-[#f5e9df]">
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
