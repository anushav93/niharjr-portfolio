/**
 * Contentful Content Population Script
 * 
 * Creates initial content entries for Homepage, About Page, and Site Settings
 * 
 * Usage: npx ts-node scripts/populate-content.ts
 */

import contentfulManagement from 'contentful-management';
const { createClient } = contentfulManagement;
import dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN || process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

// ============================================================================
// Content Data
// ============================================================================

const homepageContent = {
  tagline: { 'en-US': 'NJR' },
  title: { 'en-US': 'Visual Storyteller & Photographer' },
  description: { 'en-US': 'Capturing moments that speak louder than words. Based in Hyderabad, available worldwide.' },
  missionTitle: { 'en-US': 'My Mission' },
  missionDescription: { 'en-US': 'To capture the essence of life through my lens, creating timeless images that tell stories and evoke emotions. Every frame is an opportunity to preserve a moment forever.' },
  featuredWorkTitle: { 'en-US': 'Featured Work' },
  featuredWorkDescription: { 'en-US': 'A curated selection of my best photographs across various genres and styles.' },
  featuredWorkButtonText: { 'en-US': 'View Gallery' },
};

const aboutPageContent = {
  heroTitle: { 'en-US': 'About Me' },
  heroSubtitle: { 'en-US': 'The story behind the lens' },
  yearsExperience: { 'en-US': 8 },
  mainTitle: { 'en-US': 'Hi, I\'m Nihar' },
  storyParagraphs: { 'en-US': [
    'I\'m a passionate photographer based in Hyderabad, India, with over 8 years of experience capturing life\'s most precious moments.',
    'My journey into photography began with a simple point-and-shoot camera, but quickly evolved into a deep love affair with visual storytelling. Today, I specialize in street photography, portraits, landscapes, and event coverage.',
    'What drives me is the ability to freeze time – to capture emotions, atmospheres, and stories that might otherwise be forgotten. Every photograph I take is a piece of my heart, carefully composed and thoughtfully captured.',
    'When I\'m not behind the camera, you\'ll find me exploring new locations, experimenting with different techniques, or mentoring aspiring photographers who share my passion for this beautiful art form.'
  ] },
  skills: { 'en-US': ['Street Photography', 'Portrait Photography', 'Landscape Photography', 'Event Coverage', 'Photo Editing', 'Visual Storytelling'] },
  approachTitle: { 'en-US': 'My Approach' },
  approachDescription: { 'en-US': 'I believe in authentic moments over posed perfection. My approach combines technical expertise with artistic intuition, allowing me to capture genuine emotions and create images that resonate with viewers on a deeper level.' },
  ctaTitle: { 'en-US': 'Let\'s Create Together' },
  ctaDescription: { 'en-US': 'Whether you need a portrait session, event coverage, or creative collaboration, I\'m here to bring your vision to life.' },
  primaryButtonText: { 'en-US': 'Get in Touch' },
  secondaryButtonText: { 'en-US': 'View Portfolio' },
};

const siteSettingsContent = {
  siteTitle: { 'en-US': 'NJR Photography' },
  siteDescription: { 'en-US': 'Professional photography services by Nihar J Reddy. Capturing life\'s beautiful moments through the lens.' },
  email: { 'en-US': 'hello@njrphotography.com' },
  phone: { 'en-US': '+91 98765 43210' },
  location: { 'en-US': 'Hyderabad, India' },
};

// ============================================================================
// Main Script
// ============================================================================

async function createEntry(
  environment: any,
  contentTypeId: string,
  fields: Record<string, any>,
  entryId?: string
): Promise<boolean> {
  try {
    console.log(`📋 Creating ${contentTypeId} entry...`);
    
    // Check if entry already exists
    try {
      const entries = await environment.getEntries({
        content_type: contentTypeId,
        limit: 1,
      });
      
      if (entries.items.length > 0) {
        console.log(`⚠️  ${contentTypeId} entry already exists, skipping...`);
        return true;
      }
    } catch (e) {
      // Content type might not exist
    }
    
    const entry = await environment.createEntry(contentTypeId, {
      fields,
    });
    
    // Publish the entry
    await entry.publish();
    console.log(`✅ Created and published: ${contentTypeId}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Failed to create ${contentTypeId}:`, error.message);
    if (error.details) {
      console.error('   Details:', JSON.stringify(error.details, null, 2));
    }
    return false;
  }
}

async function main() {
  console.log('📋 Starting Contentful content population...\n');
  
  // Validate environment variables
  if (!SPACE_ID || !MANAGEMENT_TOKEN) {
    console.error('❌ Missing required environment variables:');
    if (!SPACE_ID) console.error('   - CONTENTFUL_SPACE_ID');
    if (!MANAGEMENT_TOKEN) console.error('   - CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN');
    process.exit(1);
  }
  
  try {
    // Initialize Contentful client
    const client = createClient({
      accessToken: MANAGEMENT_TOKEN,
    });
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT);
    
    console.log(`✅ Connected to Contentful space: ${space.name}`);
    console.log(`📋 Environment: ${ENVIRONMENT}\n`);
    
    // Create content entries
    let success = true;
    
    // Homepage
    success = await createEntry(environment, 'homepage', homepageContent) && success;
    
    // About Page
    success = await createEntry(environment, 'aboutPage', aboutPageContent) && success;
    
    // Site Settings
    success = await createEntry(environment, 'siteSettings', siteSettingsContent) && success;
    
    console.log('\n' + (success ? '✅' : '⚠️') + ' Content population complete!');
    
    if (success) {
      console.log('\n📋 Next steps:');
      console.log('   1. Visit your Contentful dashboard to review the content');
      console.log('   2. Upload hero images and portrait image manually');
      console.log('   3. Link gallery collections to homepage featured images');
    }
    
  } catch (error: any) {
    console.error('❌ Population failed:', error.message);
    process.exit(1);
  }
}

main();
