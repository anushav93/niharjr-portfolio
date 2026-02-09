/**
 * Fix Homepage Description Field Widget
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
  console.log('📋 Fixing Homepage Description field...\n');
  
  if (!SPACE_ID || !MANAGEMENT_TOKEN) {
    console.error('❌ Missing environment variables');
    process.exit(1);
  }
  
  const client = createClient({ accessToken: MANAGEMENT_TOKEN });
  const space = await client.getSpace(SPACE_ID);
  const environment = await space.getEnvironment(ENVIRONMENT);
  
  console.log(`✅ Connected to: ${space.name}\n`);
  
  try {
    // Get the homepage content type
    console.log('📋 Fetching Homepage content type...');
    let contentType = await environment.getContentType('homepage');
    console.log(`   Current version: ${contentType.sys.version}`);
    
    // Unpublish to make changes
    console.log('\n📋 Unpublishing content type...');
    try {
      contentType = await contentType.unpublish();
      console.log('   ✓ Unpublished');
    } catch (e) {
      console.log('   Already unpublished');
    }
    
    // Find and update the description field
    console.log('\n📋 Updating description field...');
    const descriptionFieldIndex = contentType.fields.findIndex(f => f.id === 'description');
    
    if (descriptionFieldIndex === -1) {
      console.error('   ❌ Description field not found!');
      process.exit(1);
    }
    
    // Update the field with correct configuration
    contentType.fields[descriptionFieldIndex] = {
      id: 'description',
      name: 'Description',
      type: 'Text',
      required: false,
      localized: false,
      validations: [],
    };
    
    // Save changes
    console.log('   Updating content type...');
    contentType = await contentType.update();
    console.log('   ✓ Updated');
    
    // Publish
    console.log('\n📋 Publishing content type...');
    contentType = await contentType.publish();
    console.log('   ✓ Published');
    
    // Now update the editor interface to use the correct widget
    console.log('\n📋 Updating editor interface...');
    try {
      const editorInterface = await environment.getEditorInterfaceForContentType('homepage');
      
      // Find the description field control
      const descriptionControl = editorInterface.controls?.find(c => c.fieldId === 'description');
      
      if (descriptionControl) {
        // Set it to use the textarea widget (single line text widget)
        descriptionControl.widgetId = 'multipleLine';
        descriptionControl.widgetNamespace = 'builtin';
        
        await editorInterface.update();
        console.log('   ✓ Editor interface updated');
      } else {
        console.log('   Description control not found in editor interface');
      }
    } catch (e: any) {
      console.log('   Could not update editor interface:', e.message);
    }
    
    console.log('\n✅ Homepage description field fixed!');
    console.log('   Please refresh your Contentful UI to see the changes.');
    
  } catch (error: any) {
    console.error('\n❌ Failed:', error.message);
    if (error.details) {
      console.error('Details:', JSON.stringify(error.details, null, 2));
    }
  }
}

main();
