/**
 * Create Homepage Entry in Contentful
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
  console.log('📋 Creating Homepage entry...\n');
  
  if (!SPACE_ID || !MANAGEMENT_TOKEN) {
    console.error('❌ Missing environment variables');
    process.exit(1);
  }
  
  const client = createClient({ accessToken: MANAGEMENT_TOKEN });
  const space = await client.getSpace(SPACE_ID);
  const environment = await space.getEnvironment(ENVIRONMENT);
  
  console.log(`✅ Connected to: ${space.name}`);
  
  try {
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
    console.error('❌ Failed:', error.message);
    if (error.details) {
      console.error('Details:', JSON.stringify(error.details, null, 2));
    }
  }
}

main();
