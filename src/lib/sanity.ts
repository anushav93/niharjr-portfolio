import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Get your project ID and dataset from your sanity.json or from the management console
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Create the client (works on both server and client)
export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false, // Disable CDN for real-time data
  token: process.env.SANITY_API_TOKEN, // Add the API token for write access
  perspective: 'published', // Always fetch published content
})

// Create image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Type definitions for your content
export interface Homepage {
  hero: {
    tagline: string
    title: string
    description: string
    heroImages: any[]
  }
  missionStatement: {
    title: string
    description: string
  }
  categories: Array<{
    label: string
    title: string
    description: string
    galleryFilter: string
  }>
  featuredWork: {
    sectionTitle: string
    sectionDescription: string
    buttonText: string
    featuredImages?: any[]
  }
}

export interface AboutPage {
  hero: {
    title: string
    subtitle: string
  }
  story: {
    portraitImage: any
    yearsExperience: number
    mainTitle: string
    storyParagraphs: string[]
    skills: string[]
  }
  approach: {
    sectionTitle: string
    sectionDescription: string
    principles: Array<{
      icon: string
      title: string
      description: string
    }>
  }
  callToAction: {
    title: string
    description: string
    primaryButtonText: string
    secondaryButtonText: string
  }
}

export interface SiteSettings {
  siteInfo: {
    siteTitle: string
    siteDescription: string
    siteLogo: any
    siteUrl: string
  }
  contactInfo: {
    email: string
    phone?: string
    location?: string
    availability: {
      isAvailable: boolean
      availabilityMessage?: string
    }
  }
  socialMedia: {
    instagram?: string
    twitter?: string
    facebook?: string
    linkedin?: string
    youtube?: string
    behance?: string
  }
  footer: {
    copyrightText: string
    footerDescription?: string
    quickLinks?: Array<{
      title: string
      url: string
      openInNewTab: boolean
    }>
  }
  seo: {
    defaultImage?: any
    keywords?: string[]
    googleAnalyticsId?: string
  }
}

// Helper functions for fetching content
export async function getHomepage(): Promise<Homepage | null> {
  try {
    return await client.fetch(`*[_type == "homepage" && _id == "homepage"][0]`)
  } catch (error) {
    console.error('Error fetching homepage:', error)
    return null
  }
}

export async function getAboutPage(): Promise<AboutPage | null> {
  try {
    return await client.fetch(`*[_type == "aboutPage" && _id == "aboutPage"][0]`)
  } catch (error) {
    console.error('Error fetching about page:', error)
    return null
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(`*[_type == "siteSettings" && _id == "siteSettings"][0]`)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}
