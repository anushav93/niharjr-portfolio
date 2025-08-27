import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'

// Import your schemas
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/structure'

// You'll need to replace these with your actual Sanity project credentials
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'nihar-portfolio',
  title: '📸 Nihar J Reddy Photography',
  
  projectId,
  dataset,
  
  // Makes Studio available at localhost:3000/admin
  basePath: '/admin',
  
  plugins: [
    structureTool({
      structure, // Custom structure to match website layout
    }),
    visionTool(), // For testing GROQ queries
    colorInput(), // For color pickers
  ],

  schema: {
    types: schemaTypes,
  },

  // Document actions (what you can do with documents)
  document: {
    actions: (prev, { schemaType }) => {
      // For singleton documents (homepage, about, settings), hide duplicate action
      if (['homepage', 'aboutPage', 'siteSettings'].includes(schemaType)) {
        return prev.filter(({ action }) => action !== 'duplicate')
      }
      return prev
    },
  },
})
