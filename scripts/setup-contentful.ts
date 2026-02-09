/**
 * Contentful Content Model Setup Script
 * 
 * This script creates all required content types in Contentful:
 * - Homepage
 * - About Page
 * - Site Settings
 * - Gallery Collection
 * 
 * Usage:
 *   npx ts-node scripts/setup-contentful.ts
 * 
 * Required environment variables:
 *   - CONTENTFUL_SPACE_ID
 *   - CONTENTFUL_MANAGEMENT_TOKEN
 *   - CONTENTFUL_ENVIRONMENT (optional, defaults to 'master')
 */

import pkg from 'contentful-management';
const { createClient } = pkg;
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ============================================================================
// Configuration
// ============================================================================

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN || process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

// ============================================================================
// Utility Functions
// ============================================================================

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const prefix = {
    info: '📋',
    success: '✅',
    error: '❌',
    warn: '⚠️',
  };
  console.log(`${prefix[type]} ${message}`);
}

// ============================================================================
// Content Type Definitions
// ============================================================================

const contentTypes = [
  {
    id: 'homepage',
    name: 'Homepage',
    displayField: 'title',
    description: 'Homepage content including hero, mission, and featured work',
    fields: [
      { id: 'tagline', name: 'Tagline', type: 'Symbol', required: true },
      { id: 'title', name: 'Title', type: 'Symbol', required: true },
      { id: 'description', name: 'Description', type: 'Text', required: false },
      { 
        id: 'heroImages', 
        name: 'Hero Images', 
        type: 'Array',
        items: { type: 'Link', linkType: 'Asset' },
        required: false 
      },
      { id: 'missionTitle', name: 'Mission Title', type: 'Symbol', required: false },
      { id: 'missionDescription', name: 'Mission Description', type: 'Text', required: false },
      { id: 'categories', name: 'Categories', type: 'Object', required: false },
      { id: 'featuredWorkTitle', name: 'Featured Work Title', type: 'Symbol', required: false },
      { id: 'featuredWorkDescription', name: 'Featured Work Description', type: 'Text', required: false },
      { id: 'featuredWorkButtonText', name: 'Featured Work Button Text', type: 'Symbol', required: false },
      { 
        id: 'featuredImages', 
        name: 'Featured Images', 
        type: 'Array',
        items: { type: 'Link', linkType: 'Asset' },
        required: false 
      },
    ],
  },
  {
    id: 'aboutPage',
    name: 'About Page',
    displayField: 'heroTitle',
    description: 'About page content including story, skills, and approach',
    fields: [
      { id: 'heroTitle', name: 'Hero Title', type: 'Symbol', required: true },
      { id: 'heroSubtitle', name: 'Hero Subtitle', type: 'Symbol', required: false },
      { 
        id: 'portraitImage', 
        name: 'Portrait Image', 
        type: 'Link',
        linkType: 'Asset',
        required: false 
      },
      { id: 'yearsExperience', name: 'Years Experience', type: 'Integer', required: false },
      { id: 'mainTitle', name: 'Main Title', type: 'Symbol', required: false },
      { 
        id: 'storyParagraphs', 
        name: 'Story Paragraphs', 
        type: 'Array',
        items: { type: 'Symbol' },
        required: false 
      },
      { 
        id: 'skills', 
        name: 'Skills', 
        type: 'Array',
        items: { type: 'Symbol' },
        required: false 
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
    id: 'siteSettings',
    name: 'Site Settings',
    displayField: 'siteTitle',
    description: 'Global site settings including contact info, social links, and SEO',
    fields: [
      { id: 'siteTitle', name: 'Site Title', type: 'Symbol', required: true },
      { id: 'siteDescription', name: 'Site Description', type: 'Text', required: false },
      { 
        id: 'siteLogo', 
        name: 'Site Logo', 
        type: 'Link',
        linkType: 'Asset',
        required: false 
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
        required: false 
      },
      { 
        id: 'keywords', 
        name: 'Keywords', 
        type: 'Array',
        items: { type: 'Symbol' },
        required: false 
      },
      { id: 'googleAnalyticsId', name: 'Google Analytics ID', type: 'Symbol', required: false },
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
        required: false 
      },
      { id: 'order', name: 'Display Order', type: 'Integer', required: false },
    ],
  },
];

// ============================================================================
// Main Setup Function
// ============================================================================

async function setupContentful() {
  log('Starting Contentful content model setup...', 'info');

  // Validate environment
  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN) {
    log('Missing required environment variables:', 'error');
    log('  - CONTENTFUL_SPACE_ID', 'error');
    log('  - CONTENTFUL_MANAGEMENT_TOKEN', 'error');
    process.exit(1);
  }

  // Initialize client
  const client = createClient({
    accessToken: CONTENTFUL_MANAGEMENT_TOKEN,
  });

  try {
    const space = await client.getSpace(CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment(CONTENTFUL_ENVIRONMENT);

    log(`Connected to Contentful space: ${space.name}`, 'success');
    log(`Environment: ${CONTENTFUL_ENVIRONMENT}`, 'info');

    // Create content types
    for (const contentType of contentTypes) {
      log(`\nCreating content type: ${contentType.name}`, 'info');

      try {
        // Check if content type already exists
        try {
          const existing = await environment.getContentType(contentType.id);
          log(`Content type "${contentType.name}" already exists, updating...`, 'warn');
          
          // Update fields
          existing.name = contentType.name;
          existing.description = contentType.description;
          existing.displayField = contentType.displayField;
          existing.fields = contentType.fields.map((field: any) => {
            const fieldDef: any = {
              id: field.id,
              name: field.name,
              type: field.type,
              required: field.required || false,
              localized: false,
            };

            if (field.type === 'Link') {
              fieldDef.linkType = field.linkType;
            }

            if (field.type === 'Array' && field.items) {
              fieldDef.items = field.items;
            }

            return fieldDef;
          });

          const updated = await existing.update();
          await updated.publish();
          log(`Updated and published: ${contentType.name}`, 'success');
          continue;
        } catch (e: any) {
          // Content type doesn't exist, create it
          if (e.name !== 'NotFound') {
            throw e;
          }
        }

        // Create new content type
        const newContentType = await environment.createContentTypeWithId(contentType.id, {
          name: contentType.name,
          description: contentType.description,
          displayField: contentType.displayField,
          fields: contentType.fields.map((field: any) => {
            const fieldDef: any = {
              id: field.id,
              name: field.name,
              type: field.type,
              required: field.required || false,
              localized: false,
            };

            if (field.type === 'Link') {
              fieldDef.linkType = field.linkType;
            }

            if (field.type === 'Array' && field.items) {
              fieldDef.items = field.items;
            }

            return fieldDef;
          }),
        });

        // Publish the content type
        await newContentType.publish();
        log(`Created and published: ${contentType.name}`, 'success');

      } catch (error: any) {
        log(`Failed to create ${contentType.name}: ${error.message}`, 'error');
      }
    }

    log('\n🎉 Content model setup complete!', 'success');
    log('\nNext steps:', 'info');
    log('  1. Run: npx ts-node scripts/migrate-images.ts', 'info');
    log('  2. Create initial content entries in Contentful dashboard', 'info');

  } catch (error: any) {
    log(`Setup failed: ${error.message}`, 'error');
    throw error;
  }
}

// Run setup
setupContentful().catch((error) => {
  console.error(error);
  process.exit(1);
});
