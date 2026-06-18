/**
 * Backfill / create singleton entries with new CMS fields
 * Usage: npx ts-node scripts/backfill-content-models.ts
 */

import { createClient } from 'contentful-management';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const TOKEN =
  process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN ||
  process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENV = process.env.CONTENTFUL_ENVIRONMENT || 'master';

const quickLinks = [
  { title: 'Home', url: '/', openInNewTab: false },
  { title: 'Gallery', url: '/gallery', openInNewTab: false },
  { title: 'About', url: '/about', openInNewTab: false },
  { title: 'Contact', url: '/contact', openInNewTab: false },
];

const certificates = [
  { title: 'Digital Cinematography', filePath: '/certificates/digital-cinematography.pdf' },
  { title: 'Wedding Photography', filePath: '/certificates/wedding-photography-certificate.pdf' },
];

const principles = [
  { icon: '01', title: 'Authenticity', description: 'Capturing genuine moments and real emotions.' },
  { icon: '02', title: 'Composition', description: 'Every frame carefully composed to tell a story.' },
  { icon: '03', title: 'Light', description: 'Working with natural light to create mood and depth.' },
];

async function getOrCreateEntry(environment: any, contentTypeId: string, fields: Record<string, unknown>) {
  const { items } = await environment.getEntries({ content_type: contentTypeId, limit: 1 });
  if (items.length > 0) {
    const entry = items[0];
    const mergedFields: Record<string, unknown> = { ...entry.fields };
    for (const [key, value] of Object.entries(fields)) {
      mergedFields[key] = value;
    }
    entry.fields = mergedFields;
    const updated = await entry.update();
    await updated.publish();
    console.log(`✅ Updated ${contentTypeId}`);
    return updated;
  }
  const entry = await environment.createEntry(contentTypeId, { fields });
  await entry.publish();
  console.log(`✅ Created ${contentTypeId}`);
  return entry;
}

async function main() {
  if (!SPACE_ID || !TOKEN) {
    console.error('Missing env vars');
    process.exit(1);
  }

  const client = createClient({ accessToken: TOKEN });
  const environment = await client.getSpace(SPACE_ID).then((s) => s.getEnvironment(ENV));

  await getOrCreateEntry(environment, 'homepage', {
    tagline: { 'en-US': 'NJR' },
    title: { 'en-US': 'Visual Storyteller & Photographer' },
    description: {
      'en-US': 'Capturing moments that speak louder than words. Based in Hyderabad, available worldwide.',
    },
    recentSectionTitle: { 'en-US': 'Recent Projects' },
    galleryCtaText: { 'en-US': 'View Full Gallery' },
  });

  await getOrCreateEntry(environment, 'aboutPage', {
    pageEyebrow: { 'en-US': 'About' },
    heroTitle: { 'en-US': 'About Me' },
    heroSubtitle: { 'en-US': 'The story behind the lens' },
    mainTitle: { 'en-US': "Hi, I'm Nihar" },
    storyParagraphs: {
      'en-US': [
        "I'm a passionate photographer based in Hyderabad, India, with over 8 years of experience capturing life's most precious moments.",
        'My journey into photography began with a simple point-and-shoot camera, but quickly evolved into a deep love affair with visual storytelling.',
      ],
    },
    skills: {
      'en-US': ['Street Photography', 'Portrait Photography', 'Landscape Photography', 'Event Coverage'],
    },
    approachTitle: { 'en-US': 'My Approach' },
    approachDescription: {
      'en-US':
        'I believe in authentic moments over posed perfection. My approach combines technical expertise with artistic intuition.',
    },
    principles: { 'en-US': principles },
    ctaTitle: { 'en-US': "Let's Create Together" },
    ctaDescription: {
      'en-US': "Whether you need a portrait session, event coverage, or creative collaboration, I'm here to bring your vision to life.",
    },
    primaryButtonText: { 'en-US': 'Get in Touch' },
    secondaryButtonText: { 'en-US': 'View Portfolio' },
  });

  await getOrCreateEntry(environment, 'galleryPage', {
    pageEyebrow: { 'en-US': 'Gallery' },
    pageTitle: { 'en-US': 'Portfolio' },
  });

  await getOrCreateEntry(environment, 'contactPage', {
    pageEyebrow: { 'en-US': 'Contact' },
    pageTitle: { 'en-US': 'Get in Touch' },
    pageSubtitle: {
      'en-US': "Available for commissions and collaborations. Let's create something together.",
    },
  });

  await getOrCreateEntry(environment, 'siteSettings', {
    siteTitle: { 'en-US': 'Nihar J Reddy Photography' },
    siteDescription: {
      'en-US':
        'Professional photographer specializing in capturing lifes beautiful moments through creative and artistic photography',
    },
    siteUrl: { 'en-US': 'https://www.negativereel.com' },
    email: { 'en-US': 'nihar@negativereel.com' },
    phone: { 'en-US': '+91 98765 43210' },
    location: { 'en-US': 'Hyderabad, India' },
    isAvailable: { 'en-US': true },
    availabilityMessage: {
      'en-US': "Available for commissions and collaborations. Let's create something together.",
    },
    instagram: { 'en-US': 'https://www.instagram.com/negative_r5/' },
    copyrightText: { 'en-US': `© ${new Date().getFullYear()} Nihar J Reddy. All Rights Reserved` },
    footerDescription: {
      'en-US':
        'Visual storytelling through photography. Capturing authentic moments and creating compelling narratives through the lens.',
    },
    quickLinks: { 'en-US': quickLinks },
    keywords: {
      'en-US': ['photography', 'portfolio', 'Nihar J Reddy', 'visual storyteller'],
    },
    clarityProjectId: { 'en-US': 't157v20ode' },
    recentProjectEyebrow: { 'en-US': 'Recent Project' },
    certificatesTitle: { 'en-US': 'Certified Professional' },
    certificatesDescription: {
      'en-US': 'Recognized qualifications in cinematography and photography',
    },
    certificates: { 'en-US': certificates },
    brandName: { 'en-US': 'NEGA+IVE' },
    contactCtaText: { 'en-US': 'Get in Touch' },
    galleryPageEyebrow: { 'en-US': 'Gallery' },
    galleryPageTitle: { 'en-US': 'Portfolio' },
    contactPageEyebrow: { 'en-US': 'Contact' },
    contactPageTitle: { 'en-US': 'Get in Touch' },
    contactPageSubtitle: {
      'en-US': "Available for commissions and collaborations. Let's create something together.",
    },
  });

  console.log('\nDone. Run: npx ts-node scripts/list-entry-ids.ts');
}

main().catch(console.error);
