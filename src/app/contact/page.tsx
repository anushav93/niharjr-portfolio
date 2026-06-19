import { notFound } from 'next/navigation';
import { getEntry } from '@/lib/contentful';
import { CONTENTFUL_ENTRIES } from '@/config/contentful';
import type { ContactPageFields, SiteSettingsFields } from '@/types/contentful';
import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import ContactInfoCards from '@/components/contact/ContactInfoCards';
import ContactForm from '@/components/ContactForm';
import { buildPageMetadata, getSiteMetadataDefaults, truncateDescription } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const [contactEntry, settingsEntry, defaults] = await Promise.all([
    getEntry<ContactPageFields>(CONTENTFUL_ENTRIES.contactPage),
    getEntry<SiteSettingsFields>(CONTENTFUL_ENTRIES.siteSettings),
    getSiteMetadataDefaults(),
  ]);

  const contact = contactEntry?.fields;
  const settings = settingsEntry?.fields;

  const description =
    contact?.pageSubtitle ||
    settings?.availabilityMessage ||
    `Get in touch with ${defaults.siteTitle} for photography inquiries and bookings.`;

  return buildPageMetadata({
    title: contact?.pageTitle || 'Contact',
    description: truncateDescription(description),
    path: '/contact',
  });
}

export default async function ContactPage() {
  const [contactEntry, settingsEntry] = await Promise.all([
    getEntry<ContactPageFields>(CONTENTFUL_ENTRIES.contactPage),
    getEntry<SiteSettingsFields>(CONTENTFUL_ENTRIES.siteSettings),
  ]);

  if (!contactEntry || !settingsEntry) notFound();

  const contact = contactEntry.fields;
  const settings = settingsEntry.fields;

  return (
    <div className="min-h-screen bg-page">
      <PageHeader
        eyebrow={contact.pageEyebrow!}
        title={contact.pageTitle}
        subtitle={contact.pageSubtitle || settings.availabilityMessage}
      />
      <ContactInfoCards
        email={settings.email}
        phone={settings.phone}
        location={settings.location}
      />
      <div className="max-w-2xl mx-auto px-6 pb-16">
        <ContactForm />
      </div>
    </div>
  );
}
