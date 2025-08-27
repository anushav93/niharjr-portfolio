export default {
  name: 'homepage',
  title: '🏠 Homepage Content',
  type: 'document',
  icon: () => '🏠',
  description: 'Manage all content that appears on your homepage',
  
  // Only allow one homepage document
  __experimental_formBuilder: { __unstable_initialValueTemplateItems: [] },
  
  fields: [
    // Hero Section
    {
      name: 'hero',
      title: '✨ Hero Section',
      type: 'object',
      description: 'The main hero area at the top of your homepage',
      options: {
        collapsible: true,
        collapsed: false, // Keep open by default
      },
      fields: [
        {
          name: 'tagline',
          title: 'Tagline',
          type: 'string',
          description: 'Small text that appears above your name (e.g., "VISUAL STORYTELLER")',
          validation: (Rule: any) => Rule.required(),
          initialValue: 'VISUAL STORYTELLER',
        },
        {
          name: 'title',
          title: 'Your Name',
          type: 'string',
          description: 'Your name as it appears prominently on the homepage',
          validation: (Rule: any) => Rule.required(),
          initialValue: 'NIHAR J REDDY',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          description: 'Brief description of what you do (appears under your name)',
          validation: (Rule: any) => Rule.required().max(200),
          initialValue: 'Capturing authentic moments and creating compelling narratives through the lens',
        },
        {
          name: 'heroImages',
          title: 'Hero Background Images',
          type: 'array',
          description: 'Upload 6 images for the animated background (these create the visual effect behind your name)',
          of: [
            {
              type: 'image',
              options: {
                hotspot: true, // Allows smart cropping
              },
            }
          ],
          validation: (Rule: any) => Rule.max(6).error('Please use exactly 6 images for the best visual effect'),
        },
      ],
    },

    // Mission Statement Section
    {
      name: 'missionStatement',
      title: '🎯 Mission Statement',
      type: 'object',
      description: 'The centered text section below the hero',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'title',
          title: 'Mission Title',
          type: 'string',
          description: 'Main headline for this section',
          initialValue: 'Every Frame Tells a Story',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'description',
          title: 'Mission Description',
          type: 'text',
          rows: 3,
          description: 'Describe your photography philosophy and approach',
          initialValue: 'Through my lens, I capture the extraordinary in the ordinary, creating visual narratives that resonate with emotion and authenticity.',
          validation: (Rule: any) => Rule.required().max(300),
        },
      ],
    },

    // Three Column Categories
    {
      name: 'categories',
      title: '📂 Photography Categories',
      type: 'array',
      description: 'The three main categories showcased on your homepage',
      of: [
        {
          type: 'object',
          name: 'category',
          fields: [
            {
              name: 'label',
              title: 'Category Label',
              type: 'string',
              description: 'Short label that appears above the title (e.g., "NATURE")',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Category Title',
              type: 'string',
              description: 'Main title for this category (e.g., "Landscapes")',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Category Description',
              type: 'text',
              rows: 2,
              description: 'Brief description of this photography category',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'galleryFilter',
              title: 'Gallery Filter Name',
              type: 'string',
              description: 'The exact filter name in your gallery (must match your Unsplash collection name)',
              placeholder: 'e.g., "Nature and the Landscapes"',
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'label',
              description: 'description',
            },
            prepare({ title, subtitle, description }: any) {
              return {
                title: title,
                subtitle: subtitle,
                media: () => '📸',
              }
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.length(3).error('Please add exactly 3 categories'),
      initialValue: [
        {
          label: 'NATURE',
          title: 'Landscapes',
          description: 'Capturing the raw beauty and serene moments found in natural environments, from mountains to coastlines.',
          galleryFilter: 'Nature and the Landscapes',
        },
        {
          label: 'CONSTRUCTION SITE',
          title: 'People',
          description: 'A collection of portraits and candid moments that tell the stories of individuals from diverse backgrounds.',
          galleryFilter: 'Construction Site',
        },
        {
          label: 'HEARTS',
          title: 'Melting hearts',
          description: 'A series focused on capturing intimate and heartfelt connections between people.',
          galleryFilter: 'Melting Hearts',
        },
      ],
    },

    // Featured Work Section
    {
      name: 'featuredWork',
      title: '⭐ Featured Work Section',
      type: 'object',
      description: 'Settings for the featured work section at the bottom of your homepage',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          description: 'Main title for the featured work section',
          initialValue: 'Latest Captures',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'sectionDescription',
          title: 'Section Description',
          type: 'text',
          rows: 2,
          description: 'Description text for the featured work section',
          initialValue: 'A curated selection of my most recent work, showcasing diverse styles and subjects.',
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          description: 'Text for the button that links to the full gallery',
          initialValue: 'View All Work',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'featuredImages',
          title: 'Featured Work Images',
          type: 'array',
          description: 'Upload 6 images to showcase in the featured work section',
          of: [
            {
              type: 'image',
              options: {
                hotspot: true, // Allows smart cropping
              },
            }
          ],
          validation: (Rule: any) => Rule.max(6).error('Please use exactly 6 images for the featured work section'),
        },
      ],
    },
  ],

  // Preview in the studio
  preview: {
    select: {
      title: 'hero.title',
    },
    prepare() {
      return {
        title: 'Homepage Content',
        subtitle: 'Main page content and sections',
        media: () => '🏠',
      }
    },
  },
}
