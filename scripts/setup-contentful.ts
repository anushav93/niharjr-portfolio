/**
 * Contentful Content Model Setup Script
 *
 * Usage: npx ts-node scripts/setup-contentful.ts
 */

import { createClient } from 'contentful-management';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_MANAGEMENT_TOKEN =
  process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN ||
  process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const prefix = { info: '📋', success: '✅', error: '❌', warn: '⚠️' };
  console.log(`${prefix[type]} ${message}`);
}

function mapFields(fields: Array<Record<string, unknown>>) {
  return fields.map((field) => {
    const fieldDef: Record<string, unknown> = {
      id: field.id,
      name: field.name,
      type: field.type,
      required: field.required || false,
      localized: false,
    };
    if (field.type === 'Link') fieldDef.linkType = field.linkType;
    if (field.type === 'Array' && field.items) fieldDef.items = field.items;
    if (field.validations) fieldDef.validations = field.validations;
    return fieldDef;
  });
}

const contentTypes = [
  {
    id: 'homepage',
    name: 'Homepage',
    displayField: 'title',
    description: 'Homepage hero and recent projects',
    fields: [
      { id: 'tagline', name: 'Tagline', type: 'Symbol', required: true },
      { id: 'title', name: 'Title', type: 'Symbol', required: true },
      { id: 'description', name: 'Description', type: 'Text', required: false },
      {
        id: 'recentProjects',
        name: 'Recent Projects',
        type: 'Array',
        items: { type: 'Link', linkType: 'Entry' },
        required: false,
        validations: [{ linkContentType: ['recentProject'] }],
      },
      { id: 'recentSectionTitle', name: 'Recent Section Title', type: 'Symbol', required: false },
      { id: 'galleryCtaText', name: 'Gallery CTA Text', type: 'Symbol', required: false },
    ],
  },
  {
    id: 'recentProject',
    name: 'Recent Project',
    displayField: 'title',
    description: 'A recent project gallery',
    fields: [
      { id: 'title', name: 'Title', type: 'Symbol', required: true },
      { id: 'url', name: 'URL Slug', type: 'Symbol', required: true },
      {
        id: 'assets',
        name: 'Assets',
        type: 'Array',
        items: { type: 'Link', linkType: 'Asset' },
        required: false,
      },
    ],
  },
  {
    id: 'aboutPage',
    name: 'About Page',
    displayField: 'heroTitle',
    description: 'About page content',
    fields: [
      { id: 'pageEyebrow', name: 'Page Eyebrow', type: 'Symbol', required: false },
      { id: 'heroTitle', name: 'Hero Title', type: 'Symbol', required: true },
      { id: 'heroSubtitle', name: 'Hero Subtitle', type: 'Symbol', required: false },
      {
        id: 'portraitImage',
        name: 'Portrait Image',
        type: 'Link',
        linkType: 'Asset',
        required: false,
      },
      { id: 'yearsExperience', name: 'Years Experience', type: 'Integer', required: false },
      { id: 'mainTitle', name: 'Main Title', type: 'Symbol', required: false },
      {
        id: 'storyParagraphs',
        name: 'Story Paragraphs',
        type: 'Array',
        items: { type: 'Symbol' },
        required: false,
      },
      {
        id: 'skills',
        name: 'Skills',
        type: 'Array',
        items: { type: 'Symbol' },
        required: false,
      },
      { id: 'approachTitle', name: 'Approach Title', type: 'Symbol', required: false },
      { id: 'approachDescription', name: 'Approach Description', type: 'Text', required: false },
      { id: 'principles', name: 'Principles', type: 'Object', required: false },
      { id: 'ctaTitle', name: 'CTA Title', type: 'Symbol', required: false },
      { id: 'ctaDescription', name: 'CTA Description', type: 'Text', required: false },
      { id: 'primaryButtonText', name: 'Primary Button Text', type: 'Symbol', required: false },
      { id: 'secondaryButtonText', name: 'Secondary Button Text', type: 'Symbol', required: false },
    ],
  },
  {
    id: 'galleryPage',
    name: 'Gallery Page',
    displayField: 'pageTitle',
    description: 'Gallery page header content',
    fields: [
      { id: 'pageEyebrow', name: 'Page Eyebrow', type: 'Symbol', required: false },
      { id: 'pageTitle', name: 'Page Title', type: 'Symbol', required: true },
      { id: 'pageSubtitle', name: 'Page Subtitle', type: 'Text', required: false },
    ],
  },
  {
    id: 'contactPage',
    name: 'Contact Page',
    displayField: 'pageTitle',
    description: 'Contact page header content',
    fields: [
      { id: 'pageEyebrow', name: 'Page Eyebrow', type: 'Symbol', required: false },
      { id: 'pageTitle', name: 'Page Title', type: 'Symbol', required: true },
      { id: 'pageSubtitle', name: 'Page Subtitle', type: 'Text', required: false },
    ],
  },
  {
    id: 'siteSettings',
    name: 'Site Settings',
    displayField: 'siteTitle',
    description: 'Global site settings',
    fields: [
      { id: 'siteTitle', name: 'Site Title', type: 'Symbol', required: true },
      { id: 'siteDescription', name: 'Site Description', type: 'Text', required: false },
      {
        id: 'siteLogo',
        name: 'Site Logo',
        type: 'Link',
        linkType: 'Asset',
        required: false,
      },
      { id: 'siteUrl', name: 'Site URL', type: 'Symbol', required: false },
      { id: 'email', name: 'Email', type: 'Symbol', required: true },
      { id: 'phone', name: 'Phone', type: 'Symbol', required: false },
      { id: 'location', name: 'Location', type: 'Symbol', required: false },
      { id: 'isAvailable', name: 'Is Available', type: 'Boolean', required: false },
      { id: 'availabilityMessage', name: 'Availability Message', type: 'Symbol', required: false },
      { id: 'instagram', name: 'Instagram', type: 'Symbol', required: false },
      { id: 'twitter', name: 'Twitter', type: 'Symbol', required: false },
      { id: 'facebook', name: 'Facebook', type: 'Symbol', required: false },
      { id: 'linkedin', name: 'LinkedIn', type: 'Symbol', required: false },
      { id: 'youtube', name: 'YouTube', type: 'Symbol', required: false },
      { id: 'behance', name: 'Behance', type: 'Symbol', required: false },
      { id: 'copyrightText', name: 'Copyright Text', type: 'Symbol', required: false },
      { id: 'footerDescription', name: 'Footer Description', type: 'Text', required: false },
      { id: 'quickLinks', name: 'Quick Links', type: 'Object', required: false },
      {
        id: 'defaultImage',
        name: 'Default SEO Image',
        type: 'Link',
        linkType: 'Asset',
        required: false,
      },
      {
        id: 'keywords',
        name: 'Keywords',
        type: 'Array',
        items: { type: 'Symbol' },
        required: false,
      },
      { id: 'googleAnalyticsId', name: 'Google Analytics ID', type: 'Symbol', required: false },
      { id: 'clarityProjectId', name: 'Clarity Project ID', type: 'Symbol', required: false },
      { id: 'recentProjectEyebrow', name: 'Recent Project Eyebrow', type: 'Symbol', required: false },
      { id: 'certificatesTitle', name: 'Certificates Title', type: 'Symbol', required: false },
      { id: 'certificatesDescription', name: 'Certificates Description', type: 'Text', required: false },
      { id: 'certificates', name: 'Certificates', type: 'Object', required: false },
      { id: 'brandName', name: 'Brand Name', type: 'Symbol', required: false },
      { id: 'contactCtaText', name: 'Contact CTA Text', type: 'Symbol', required: false },
      { id: 'galleryPageEyebrow', name: 'Gallery Page Eyebrow', type: 'Symbol', required: false },
      { id: 'galleryPageTitle', name: 'Gallery Page Title', type: 'Symbol', required: false },
      { id: 'galleryPageSubtitle', name: 'Gallery Page Subtitle', type: 'Text', required: false },
      { id: 'contactPageEyebrow', name: 'Contact Page Eyebrow', type: 'Symbol', required: false },
      { id: 'contactPageTitle', name: 'Contact Page Title', type: 'Symbol', required: false },
      { id: 'contactPageSubtitle', name: 'Contact Page Subtitle', type: 'Text', required: false },
    ],
  },
  {
    id: 'galleryCollection',
    name: 'Gallery Collection',
    displayField: 'name',
    description: 'Photo collections for the gallery',
    fields: [
      { id: 'name', name: 'Name', type: 'Symbol', required: true },
      { id: 'slug', name: 'Slug', type: 'Symbol', required: true },
      { id: 'description', name: 'Description', type: 'Text', required: false },
      {
        id: 'photos',
        name: 'Photos',
        type: 'Array',
        items: { type: 'Link', linkType: 'Asset' },
        required: false,
      },
      { id: 'order', name: 'Display Order', type: 'Integer', required: false },
    ],
  },
];

function mergeContentTypeFields(existingFields: any[], desiredFields: Array<Record<string, unknown>>) {
  const desiredKeys = new Set(desiredFields.map((f) => f.id as string));
  const existingByKey = new Map<string, any>();

  for (const field of existingFields) {
    existingByKey.set(field.apiName || field.id, field);
  }

  const merged: any[] = [...existingFields];

  for (const desired of desiredFields) {
    const key = desired.id as string;
    if (!existingByKey.has(key)) {
      merged.push(mapFields([desired])[0]);
    }
  }

  for (const field of merged) {
    const key = field.apiName || field.id;
    if (!desiredKeys.has(key) && !field.deleted) {
      field.omitted = true;
    }
  }

  return merged;
}

async function setupContentful() {
  log('Starting Contentful content model setup...', 'info');

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN) {
    log('Missing CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN', 'error');
    process.exit(1);
  }

  const client = createClient({ accessToken: CONTENTFUL_MANAGEMENT_TOKEN });
  const space = await client.getSpace(CONTENTFUL_SPACE_ID);
  const environment = await space.getEnvironment(CONTENTFUL_ENVIRONMENT);

  log(`Connected to space: ${space.name}`, 'success');

  for (const contentType of contentTypes) {
    log(`Processing: ${contentType.name}`, 'info');
    try {
      try {
        const existing = await environment.getContentType(contentType.id);
        existing.name = contentType.name;
        existing.description = contentType.description;
        existing.displayField = contentType.displayField;
        existing.fields = mergeContentTypeFields(existing.fields, contentType.fields);
        const updated = await existing.update();
        await updated.publish();
        log(`Updated: ${contentType.name}`, 'success');
      } catch (e: unknown) {
        if ((e as { name?: string }).name !== 'NotFound') throw e;
        const created = await environment.createContentTypeWithId(contentType.id, {
          name: contentType.name,
          description: contentType.description,
          displayField: contentType.displayField,
          fields: mapFields(contentType.fields) as any,
        });
        await created.publish();
        log(`Created: ${contentType.name}`, 'success');
      }
    } catch (error: unknown) {
      log(`Failed ${contentType.name}: ${(error as Error).message}`, 'error');
    }
  }

  log('Content model setup complete!', 'success');
}

setupContentful().catch((error) => {
  console.error(error);
  process.exit(1);
});
