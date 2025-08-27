export default {
  name: 'aboutPage',
  title: '👨‍💼 About Page Content',
  type: 'document',
  icon: () => '👨‍💼',
  description: 'Manage all content on your About page',

  fields: [
    // Hero Section
    {
      name: 'hero',
      title: '✨ About Page Header',
      type: 'object',
      description: 'The header section at the top of your About page',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'title',
          title: 'Page Title',
          type: 'string',
          description: 'Your name as it appears at the top of the About page',
          initialValue: 'Nihar J Reddy',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'subtitle',
          title: 'Your Title/Role',
          type: 'string',
          description: 'Your professional title or description',
          initialValue: 'Visual storyteller, photographer, and creative director',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },

    // Main Story Section
    {
      name: 'story',
      title: '📖 Your Story',
      type: 'object',
      description: 'The main content area with your photo and biography',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'portraitImage',
          title: 'Your Portrait Photo',
          type: 'image',
          description: 'Professional photo of yourself for the About page',
          options: {
            hotspot: true,
          },
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'yearsExperience',
          title: 'Years of Experience',
          type: 'number',
          description: 'How many years you\'ve been doing photography professionally',
          initialValue: 5,
          validation: (Rule: any) => Rule.required().min(0).max(50),
        },
        {
          name: 'mainTitle',
          title: 'Story Section Title',
          type: 'string',
          description: 'The main headline for your story section',
          initialValue: 'Creating Visual Narratives',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'storyParagraphs',
          title: 'Your Story (Paragraphs)',
          type: 'array',
          description: 'Write your story in separate paragraphs - each item becomes one paragraph',
          of: [
            {
              type: 'text',
              rows: 3,
            }
          ],
          validation: (Rule: any) => Rule.min(1).max(5),
          initialValue: [
            "I'm a professional photographer with a passion for capturing the extraordinary in the ordinary. My work spans across nature, portraits, and event photography, with each image telling a unique story.",
            "Skilled in capturing natural light, authentic emotions, and candid moments, I create beautiful, meaningful photographs that preserve the essence of special occasions and everyday beauty.",
            "When I'm not behind the camera, I'm exploring new techniques, studying the work of masters, and constantly pushing the boundaries of visual storytelling."
          ],
        },
        {
          name: 'skills',
          title: 'Skills & Expertise',
          type: 'array',
          description: 'List your main skills and areas of expertise',
          of: [
            {
              type: 'string',
            }
          ],
          validation: (Rule: any) => Rule.min(3).max(6),
          initialValue: [
            'Photography',
            'Visual Storytelling', 
            'Event Coverage',
            'Portrait Sessions'
          ],
        },
      ],
    },

    // Approach/Values Section
    {
      name: 'approach',
      title: '🎨 Your Approach',
      type: 'object',
      description: 'The section explaining your photography approach and values',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          description: 'Title for the approach section',
          initialValue: 'My Approach',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'sectionDescription',
          title: 'Section Description',
          type: 'text',
          rows: 2,
          description: 'Brief intro text for the approach section',
          initialValue: 'Three core principles guide every shot I take and every story I tell through my lens.',
        },
        {
          name: 'principles',
          title: 'Core Principles',
          type: 'array',
          description: 'Your three main photography principles or values',
          of: [
            {
              type: 'object',
              name: 'principle',
              fields: [
                {
                  name: 'icon',
                  title: 'Icon/Emoji',
                  type: 'string',
                  description: 'An emoji that represents this principle (e.g., 🎨, 📐, 📖)',
                  validation: (Rule: any) => Rule.required().max(2),
                },
                {
                  name: 'title',
                  title: 'Principle Title',
                  type: 'string',
                  description: 'Name of this principle',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'description',
                  title: 'Principle Description',
                  type: 'text',
                  rows: 2,
                  description: 'Explain this principle and how it guides your work',
                  validation: (Rule: any) => Rule.required(),
                },
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'icon',
                  description: 'description',
                },
                prepare({ title, subtitle }: any) {
                  return {
                    title: title,
                    media: () => subtitle,
                  }
                },
              },
            }
          ],
          validation: (Rule: any) => Rule.length(3).error('Please add exactly 3 principles'),
          initialValue: [
            {
              icon: '🎨',
              title: 'Craft',
              description: 'Meticulous attention to light, color, and composition creates images that stand the test of time.',
            },
            {
              icon: '📐',
              title: 'Composition',
              description: 'Strong geometric principles and visual balance create calm, harmonious imagery that draws the viewer in.',
            },
            {
              icon: '📖',
              title: 'Storytelling',
              description: 'Every frame captures human moments and emotions, anchored in place and purpose to tell meaningful stories.',
            },
          ],
        },
      ],
    },

    // Call to Action Section
    {
      name: 'callToAction',
      title: '📞 Call to Action Section',
      type: 'object',
      description: 'The final section encouraging visitors to get in touch',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'title',
          title: 'CTA Title',
          type: 'string',
          description: 'Compelling headline to encourage contact',
          initialValue: 'Let\'s Create Something Beautiful',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'description',
          title: 'CTA Description',
          type: 'text',
          rows: 2,
          description: 'Text encouraging visitors to reach out',
          initialValue: 'Ready to capture your special moments? I\'d love to discuss your vision and bring it to life.',
        },
        {
          name: 'primaryButtonText',
          title: 'Primary Button Text',
          type: 'string',
          description: 'Text for the main action button',
          initialValue: 'View My Work',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'secondaryButtonText',
          title: 'Secondary Button Text',
          type: 'string',
          description: 'Text for the secondary action button',
          initialValue: 'Get In Touch',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
  ],

  preview: {
    select: {
      title: 'hero.title',
    },
    prepare() {
      return {
        title: 'About Page Content',
        subtitle: 'Your story, skills, and approach',
        media: () => '👨‍💼',
      }
    },
  },
}
