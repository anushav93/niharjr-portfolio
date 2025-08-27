export default {
  name: 'siteSettings',
  title: '⚙️ Site Settings',
  type: 'document',
  icon: () => '⚙️',
  description: 'Global site settings, footer content, and contact information',

  fields: [
    // Basic Site Information
    {
      name: 'siteInfo',
      title: '🌐 Basic Site Information',
      type: 'object',
      description: 'Essential information about your site',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'siteTitle',
          title: 'Site Title',
          type: 'string',
          description: 'The main title of your website (appears in browser tabs and search results)',
          initialValue: 'Nihar J Reddy Photography',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'siteDescription',
          title: 'Site Description',
          type: 'text',
          rows: 2,
          description: 'Brief description of your site for SEO and social media sharing',
          initialValue: 'Professional photographer specializing in capturing lifes beautiful moments through creative and artistic photography',
          validation: (Rule: any) => Rule.required().max(160),
        },
        {
          name: 'siteLogo',
          title: 'Site Logo',
          type: 'image',
          description: 'Your logo image (will be displayed in the navigation)',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'siteUrl',
          title: 'Website URL',
          type: 'url',
          description: 'Your website URL (e.g., https://niharjreddy.com)',
          initialValue: 'https://niharjreddy.com',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },

    // Contact Information
    {
      name: 'contactInfo',
      title: '📧 Contact Information',
      type: 'object',
      description: 'Your contact details and business information',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'email',
          title: 'Primary Email',
          type: 'email',
          description: 'Your main contact email address',
          initialValue: 'nihar@niharjreddy.com',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          description: 'Your contact phone number (optional)',
        },
        {
          name: 'location',
          title: 'Location/City',
          type: 'string',
          description: 'Your city or general location (e.g., "Seattle, WA")',
        },
        {
          name: 'availability',
          title: 'Availability Status',
          type: 'object',
          description: 'Let visitors know if you\'re currently taking bookings',
          fields: [
            {
              name: 'isAvailable',
              title: 'Currently Available for Bookings',
              type: 'boolean',
              description: 'Toggle this on/off to show availability status',
              initialValue: true,
            },
            {
              name: 'availabilityMessage',
              title: 'Availability Message',
              type: 'string',
              description: 'Custom message about your availability (optional)',
              placeholder: 'e.g., "Booking sessions for Spring 2024"',
            },
          ],
        },
      ],
    },

    // Social Media
    {
      name: 'socialMedia',
      title: '📱 Social Media Links',
      type: 'object',
      description: 'Your social media profiles and links',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
          description: 'Link to your Instagram profile',
          placeholder: 'https://instagram.com/yourusername',
        },
        {
          name: 'twitter',
          title: 'Twitter/X URL',
          type: 'url',
          description: 'Link to your Twitter/X profile',
          placeholder: 'https://twitter.com/yourusername',
        },
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
          description: 'Link to your Facebook page',
          placeholder: 'https://facebook.com/yourpage',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
          description: 'Link to your LinkedIn profile',
          placeholder: 'https://linkedin.com/in/yourprofile',
        },
        {
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
          description: 'Link to your YouTube channel (if you have one)',
          placeholder: 'https://youtube.com/@yourchannel',
        },
        {
          name: 'behance',
          title: 'Behance URL',
          type: 'url',
          description: 'Link to your Behance portfolio',
          placeholder: 'https://behance.net/yourprofile',
        },
      ],
    },

    // Footer Content
    {
      name: 'footer',
      title: '🔗 Footer Content',
      type: 'object',
      description: 'Content and links that appear in your website footer',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'copyrightText',
          title: 'Copyright Text',
          type: 'string',
          description: 'Copyright notice (year will be automatically updated)',
          initialValue: '© Nihar J Reddy Photography. All rights reserved.',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'footerDescription',
          title: 'Footer Description',
          type: 'text',
          rows: 2,
          description: 'Brief description or tagline in the footer (optional)',
          placeholder: 'Capturing lifes beautiful moments through creative photography...',
        },
        {
          name: 'quickLinks',
          title: 'Quick Links',
          type: 'array',
          description: 'Additional links to show in the footer',
          of: [
            {
              type: 'object',
              name: 'link',
              fields: [
                {
                  name: 'title',
                  title: 'Link Text',
                  type: 'string',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'url',
                  title: 'Link URL',
                  type: 'string',
                  description: 'Internal links start with / (e.g., /contact), external links include https://',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'openInNewTab',
                  title: 'Open in New Tab',
                  type: 'boolean',
                  description: 'Should this link open in a new tab?',
                  initialValue: false,
                },
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'url',
                },
              },
            }
          ],
        },
      ],
    },

    // SEO Settings
    {
      name: 'seo',
      title: '🔍 SEO Settings',
      type: 'object',
      description: 'Search engine optimization settings',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'defaultImage',
          title: 'Default Social Sharing Image',
          type: 'image',
          description: 'Image that appears when your site is shared on social media (1200x630px recommended)',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'keywords',
          title: 'Site Keywords',
          type: 'array',
          description: 'Keywords that describe your photography business',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags',
          },
          initialValue: [
            'photography',
            'photographer', 
            'portraits',
            'wedding photography',
            'event photography',
            'landscape photography'
          ],
        },
        {
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
          description: 'Your Google Analytics tracking ID (optional, format: GA-XXXXXXXXX-X)',
          placeholder: 'GA-XXXXXXXXX-X',
        },
      ],
    },
  ],

  preview: {
    select: {
      title: 'siteInfo.siteTitle',
    },
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global site configuration and footer content',
        media: () => '⚙️',
      }
    },
  },
}
