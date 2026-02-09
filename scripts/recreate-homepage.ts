/**
 * Delete and Recreate Homepage Content Type
 */

import contentfulManagement from 'contentful-management';
const { createClient } = contentfulManagement;
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

async function main() {
  console.log('📋 Recreating Homepage content type...\n');
  
  if (!SPACE_ID || !MANAGEMENT_TOKEN) {
    console.error('❌ Missing environment variables');
    process.exit(1);
  }
  
  const client = createClient({ accessToken: MANAGEMENT_TOKEN });
  const space = await client.getSpace(SPACE_ID);
  const environment = await space.getEnvironment(ENVIRONMENT);
  
  console.log(`✅ Connected to: ${space.name}\n`);
  
  try {
    // Step 1: Try to delete existing content type
    console.log('📋 Step 1: Deleting existing Homepage content type...');
    try {
      let contentType = await environment.getContentType('homepage');
      
      // First unpublish if published
      try {
        contentType = await contentType.unpublish();
        console.log('   ✓ Unpublished');
      } catch (e) {
        console.log('   Already unpublished');
      }
      
      // Then delete
      await contentType.delete();
      console.log('   ✓ Deleted');
    } catch (e: any) {
      console.log('   Content type does not exist, will create fresh');
    }
    
    // Wait a moment for deletion to propagate
    await new Promise(r => setTimeout(r, 2000));
    
    // Step 2: Create new content type with proper fields
    console.log('\n📋 Step 2: Creating new Homepage content type...');
    let contentType = await environment.createContentTypeWithId('homepage', {
      name: 'Homepage',
      displayField: 'title',
      description: 'Homepage content including hero, mission, and featured work',
      fields: [
        { id: 'tagline', name: 'Tagline', type: 'Symbol', required: false, localized: false },
        { id: 'title', name: 'Title', type: 'Symbol', required: true, localized: false },
        { id: 'description', name: 'Description', type: 'Text', required: false, localized: false },
        { id: 'heroImages', name: 'Hero Images', type: 'Array', required: false, localized: false, items: { type: 'Link', linkType: 'Asset' } },
        { id: 'missionTitle', name: 'Mission Title', type: 'Symbol', required: false, localized: false },
        { id: 'missionDescription', name: 'Mission Description', type: 'Text', required: false, localized: false },
        { id: 'featuredWorkTitle', name: 'Featured Work Title', type: 'Symbol', required: false, localized: false },
        { id: 'featuredWorkDescription', name: 'Featured Work Description', type: 'Text', required: false, localized: false },
        { id: 'featuredWorkButtonText', name: 'Featured Work Button Text', type: 'Symbol', required: false, localized: false },
        { id: 'featuredImages', name: 'Featured Images', type: 'Array', required: false, localized: false, items: { type: 'Link', linkType: 'Asset' } },
      ],
    });
    console.log('   ✓ Created');
    
    // Step 3: Publish content type
    console.log('\n📋 Step 3: Publishing content type...');
    contentType = await contentType.publish();
    console.log('   ✓ Published');
    
    // Step 4: Create entry
    console.log('\n📋 Step 4: Creating Homepage entry...');
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
    console.log('   ✓ Created');
    
    // Step 5: Publish entry
    console.log('\n📋 Step 5: Publishing entry...');
    await entry.publish();
    console.log('   ✓ Published');
    
    console.log('\n✅ Homepage setup complete!');
    console.log(`   Entry ID: ${entry.sys.id}`);
    
  } catch (error: any) {
    console.error('\n❌ Failed:', error.message);
    if (error.details) {
      console.error('Details:', JSON.stringify(error.details, null, 2));
    }
  }
}

main();
