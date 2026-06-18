import { notFound } from 'next/navigation';
import { getEntry } from '@/lib/contentful';
import { CONTENTFUL_ENTRIES } from '@/config/contentful';
import type { ContactPageFields, SiteSettingsFields } from '@/types/contentful';
import PageHeader from '@/components/layout/PageHeader';
import ContactInfoCards from '@/components/contact/ContactInfoCards';
import ContactForm from '@/components/ContactForm';

export const revalidate = 60;

export default async function ContactPage() {
  const [contactEntry, settingsEntry] = await Promise.all([
    getEntry<ContactPageFields>(CONTENTFUL_ENTRIES.contactPage),
    getEntry<SiteSettingsFields>(CONTENTFUL_ENTRIES.siteSettings),
  ]);

  if (!contactEntry || !settingsEntry) notFound();

  const contact = contactEntry.fields;
  const settings = settingsEntry.fields;

  return (
    <div className="min-h-screen bg-[#f5e9df]">
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
      <div className="max-w-2xl mx-auto px-6 pb-20">
        <ContactForm />
      </div>
    </div>
  );
}
