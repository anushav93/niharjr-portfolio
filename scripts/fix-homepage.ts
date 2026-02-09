/**
 * Fix Homepage Content Type and Create Entry
 */

import contentfulManagement from 'contentful-management';
const { createClient } = contentfulManagement;
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

const homepageFields = [
  { id: 'tagline', name: 'Tagline', type: 'Symbol', required: false },
  { id: 'title', name: 'Title', type: 'Symbol', required: true },
  { id: 'description', name: 'Description', type: 'Text', required: false },
  { id: 'heroImages', name: 'Hero Images', type: 'Array', items: { type: 'Link', linkType: 'Asset' } },
  { id: 'missionTitle', name: 'Mission Title', type: 'Symbol', required: false },
  { id: 'missionDescription', name: 'Mission Description', type: 'Text', required: false },
  { id: 'featuredWorkTitle', name: 'Featured Work Title', type: 'Symbol', required: false },
  { id: 'featuredWorkDescription', name: 'Featured Work Description', type: 'Text', required: false },
  { id: 'featuredWorkButtonText', name: 'Featured Work Button Text', type: 'Symbol', required: false },
  { id: 'featuredImages', name: 'Featured Images', type: 'Array', items: { type: 'Link', linkType: 'Asset' } },
];

async function main() {
  console.log('📋 Fixing Homepage content type and creating entry...\n');
  
  if (!SPACE_ID || !MANAGEMENT_TOKEN) {
    console.error('❌ Missing environment variables');
    process.exit(1);
  }
  
  const client = createClient({ accessToken: MANAGEMENT_TOKEN });
  const space = await client.getSpace(SPACE_ID);
  const environment = await space.getEnvironment(ENVIRONMENT);
  
  console.log(`✅ Connected to: ${space.name}\n`);
  
  try {
    // Step 1: Get the current homepage content type
    console.log('📋 Fetching current Homepage content type...');
    let contentType = await environment.getContentType('homepage');
    console.log(`   Current version: ${contentType.sys.version}`);
    console.log(`   Current fields: ${contentType.fields.map(f => f.id).join(', ')}`);
    
    // Step 2: Check if we need to unpublish first
    try {
      console.log('📋 Unpublishing content type to allow edits...');
      contentType = await contentType.unpublish();
      console.log('   ✓ Unpublished');
    } catch (e: any) {
      console.log('   Already unpublished or no entries');
    }
    
    // Step 3: Update the fields
    console.log('📋 Updating fields...');
    contentType.fields = homepageFields.map(field => ({
      id: field.id,
      name: field.name,
      type: field.type,
      required: field.required || false,
      localized: false,
      ...(field.items ? { items: field.items } : {}),
    }));
    contentType.displayField = 'title';
    
    contentType = await contentType.update();
    console.log('   ✓ Fields updated');
    
    // Step 4: Publish the content type
    console.log('📋 Publishing content type...');
    contentType = await contentType.publish();
    console.log('   ✓ Published');
    
    // Step 5: Create the homepage entry
    console.log('\n📋 Creating Homepage entry...');
    const entry = await environment.createEntry('homepage', {
      fields: {
        tagline: { 'en-US': 'NJR' },
        title: { 'en-US': 'Visual Storyteller & Photographer' },
        description: { 'en-US': 'Capturing moments that speak louder than words. Based in Hyderabad, available worldwide.' },
        missionTitle: { 'en-US': 'Every Frame Tells a Story' },
        missionDescription: { 'en-US': 'Through my lens, I capture the extraordinary in the ordinary, creating visual narratives that resonate with emotion and authenticity.' },
        featuredWorkTitle: { 'en-US': 'Latest Captures' },
        featuredWorkDescription: { 'en-US': 'A curated selection of my most recent work, showcasing diverse styles and subjects.' },
        featuredWorkButtonText: { 'en-US': 'View All Work' },
      },
    });
    
    await entry.publish();
    console.log('✅ Homepage entry created and published!');
    console.log(`   Entry ID: ${entry.sys.id}`);
    
  } catch (error: any) {
    console.error('\n❌ Failed:', error.message);
    if (error.details) {
      console.error('Details:', JSON.stringify(error.details, null, 2));
    }
  }
}

main();
