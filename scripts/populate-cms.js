const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

// Initialize Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Content to populate
const content = {
  homepage: {
    _id: 'homepage',
    _type: 'homepage',
    hero: {
      tagline: 'VISUAL STORYTELLER',
      title: 'NIHAR J REDDY',
      description: 'Capturing authentic moments and creating compelling narratives through the lens'
    },
    missionStatement: {
      title: 'Every Frame Tells a Story',
      description: 'Through my lens, I capture the extraordinary in the ordinary, creating visual narratives that resonate with emotion and authenticity.'
    },
    categories: [
      {
        label: "NATURE",
        title: "Landscapes", 
        description: "Capturing the raw beauty and serene moments found in natural environments, from mountains to coastlines.",
        galleryFilter: "Nature+and+the+Landscapes",
      },
      {
        label: "CONSTRUCTION SITE",
        title: "People",
        description: "A collection of portraits and candid moments that tell the stories of individuals from diverse backgrounds.",
        galleryFilter: "Construction+Site",
      },
      {
        label: "HEARTS",
        title: "Melting hearts", 
        description: "A series focused on capturing intimate and heartfelt connections between people.",
        galleryFilter: "Melting+Hearts",
      },
    ],
    featuredWork: {
      sectionTitle: 'Latest Captures',
      sectionDescription: 'A curated selection of my most recent work, showcasing diverse styles and subjects.',
      buttonText: 'View All Work'
    }
  },
  
  aboutPage: {
    _id: 'aboutPage',
    _type: 'aboutPage',
    hero: {
      title: 'Nihar J Reddy',
      subtitle: 'Visual storyteller, photographer, and creative director'
    },
    story: {
      yearsExperience: 5,
      mainTitle: 'Creating Visual Narratives',
      storyParagraphs: [
        "I'm a professional photographer with a passion for capturing the extraordinary in the ordinary. My work spans across nature, portraits, and event photography, with each image telling a unique story.",
        "Skilled in capturing natural light, authentic emotions, and candid moments, I create beautiful, meaningful photographs that preserve the essence of special occasions and everyday beauty.",
        "When I'm not behind the camera, I'm exploring new techniques, studying the work of masters, and constantly pushing the boundaries of visual storytelling."
      ],
      skills: [
        "Photography",
        "Visual Storytelling", 
        "Event Coverage",
        "Portrait Sessions"
      ]
    },
    approach: {
      sectionTitle: 'My Approach',
      sectionDescription: 'Three core principles guide every shot I take and every story I tell through my lens.',
      principles: [
        {
          icon: '🎨',
          title: 'Craft',
          description: 'Meticulous attention to light, color, and composition creates images that stand the test of time.'
        },
        {
          icon: '📐',
          title: 'Composition',
          description: 'Strong geometric principles and visual balance create calm, harmonious imagery that draws the viewer in.'
        },
        {
          icon: '📖',
          title: 'Storytelling',
          description: 'Every frame captures human moments and emotions, anchored in place and purpose to tell meaningful stories.'
        }
      ]
    },
    callToAction: {
      title: "Let's Create Something Beautiful",
      description: 'Ready to capture your special moments? I\'d love to discuss your vision and bring it to life.',
      primaryButtonText: 'View My Work',
      secondaryButtonText: 'Get In Touch'
    }
  },
  
  siteSettings: {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteInfo: {
      siteTitle: 'Nihar J Reddy Photography',
      siteDescription: 'Professional photography services specializing in portraits, events, and nature photography',
      siteUrl: 'https://niharjreddy.com'
    },
    contactInfo: {
      email: 'nihar@niharjreddy.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      availability: {
        isAvailable: true,
        availabilityMessage: 'Currently accepting new projects and bookings'
      }
    },
    socialMedia: {
      instagram: 'https://instagram.com/niharjreddy',
      twitter: 'https://twitter.com/niharjreddy',
      linkedin: 'https://linkedin.com/in/niharjreddy',
      facebook: 'https://facebook.com/niharjreddy',
      behance: 'https://behance.net/niharjreddy',
      youtube: 'https://youtube.com/@niharjreddy'
    },
    footer: {
      copyrightText: '© Nihar J Reddy Photography. All rights reserved.'
    },
    seo: {
      keywords: [
        'photography',
        'photographer', 
        'portraits',
        'wedding photography',
        'event photography',
        'landscape photography',
        'San Francisco photographer'
      ],
      googleAnalyticsId: ''
    }
  }
}

async function populateCMS() {
  try {
    console.log('🚀 Starting CMS population...')
    
    // Create or replace each document
    for (const [key, document] of Object.entries(content)) {
      console.log(`📝 Creating ${key}...`)
      
      try {
        await client.createOrReplace(document)
        console.log(`✅ ${key} created successfully!`)
      } catch (error) {
        console.error(`❌ Error creating ${key}:`, error.message)
      }
    }
    
    console.log('\n🎉 CMS population completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Visit your Sanity Studio: https://2vi9cyd4.sanity.studio/')
    console.log('2. Check that all documents were created')
    console.log('3. Upload images for the homepage hero and about page portrait')
    console.log('4. Test your website to see the content loading from CMS')
    
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the script
populateCMS()
