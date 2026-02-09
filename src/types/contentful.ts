/**
 * Contentful Type Definitions
 * 
 * These types mirror the content models defined in Contentful.
 * They provide type safety for all CMS content operations.
 */

import type { Asset, Entry, EntryFields } from 'contentful';

// ============================================================================
// Asset Types
// ============================================================================

export interface ContentfulImage {
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
  sys: {
    id: string;
  };
}

// ============================================================================
// Homepage Content Type
// ============================================================================

export interface HomepageFields {
  /** Hero section tagline */
  tagline: EntryFields.Text;
  /** Hero section main title */
  title: EntryFields.Text;
  /** Hero section description */
  description: EntryFields.Text;
  /** Hero background images (6 images) */
  heroImages: Asset[];
  /** Mission statement title */
  missionTitle: EntryFields.Text;
  /** Mission statement description */
  missionDescription: EntryFields.Text;
  /** Category cards for gallery navigation */
  categories: CategoryCard[];
  /** Featured work section title */
  featuredWorkTitle: EntryFields.Text;
  /** Featured work section description */
  featuredWorkDescription: EntryFields.Text;
  /** Featured work button text */
  featuredWorkButtonText: EntryFields.Text;
  /** Featured work images (6 images) */
  featuredImages: Asset[];
}

export interface CategoryCard {
  label: string;
  title: string;
  description: string;
  galleryFilter: string;
}

export type HomepageEntry = Entry<HomepageFields>;

// Transformed type for component consumption
export interface Homepage {
  hero: {
    tagline: string;
    title: string;
    description: string;
    heroImages: ContentfulImage[];
  };
  missionStatement: {
    title: string;
    description: string;
  };
  categories: CategoryCard[];
  featuredWork: {
    sectionTitle: string;
    sectionDescription: string;
    buttonText: string;
    featuredImages: ContentfulImage[];
  };
}

// ============================================================================
// About Page Content Type
// ============================================================================

export interface AboutPageFields {
  /** Hero title */
  heroTitle: EntryFields.Text;
  /** Hero subtitle */
  heroSubtitle: EntryFields.Text;
  /** Portrait image for story section */
  portraitImage: Asset;
  /** Years of experience */
  yearsExperience: EntryFields.Integer;
  /** Main title for story section */
  mainTitle: EntryFields.Text;
  /** Story paragraphs */
  storyParagraphs: EntryFields.Text[];
  /** Skills list */
  skills: EntryFields.Text[];
  /** Approach section title */
  approachTitle: EntryFields.Text;
  /** Approach section description */
  approachDescription: EntryFields.Text;
  /** Approach principles */
  principles: Principle[];
  /** CTA title */
  ctaTitle: EntryFields.Text;
  /** CTA description */
  ctaDescription: EntryFields.Text;
  /** Primary button text */
  primaryButtonText: EntryFields.Text;
  /** Secondary button text */
  secondaryButtonText: EntryFields.Text;
}

export interface Principle {
  icon: string;
  title: string;
  description: string;
}

export type AboutPageEntry = Entry<AboutPageFields>;

// Transformed type for component consumption
export interface AboutPage {
  hero: {
    title: string;
    subtitle: string;
  };
  story: {
    portraitImage: ContentfulImage | null;
    yearsExperience: number;
    mainTitle: string;
    storyParagraphs: string[];
    skills: string[];
  };
  approach: {
    sectionTitle: string;
    sectionDescription: string;
    principles: Principle[];
  };
  callToAction: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
}

// ============================================================================
// Site Settings Content Type
// ============================================================================

export interface SiteSettingsFields {
  /** Site title */
  siteTitle: EntryFields.Text;
  /** Site description for SEO */
  siteDescription: EntryFields.Text;
  /** Site logo */
  siteLogo?: Asset;
  /** Site URL */
  siteUrl: EntryFields.Text;
  /** Contact email */
  email: EntryFields.Text;
  /** Contact phone */
  phone?: EntryFields.Text;
  /** Location */
  location?: EntryFields.Text;
  /** Availability status */
  isAvailable: EntryFields.Boolean;
  /** Availability message */
  availabilityMessage?: EntryFields.Text;
  /** Instagram URL */
  instagram?: EntryFields.Text;
  /** Twitter/X URL */
  twitter?: EntryFields.Text;
  /** Facebook URL */
  facebook?: EntryFields.Text;
  /** LinkedIn URL */
  linkedin?: EntryFields.Text;
  /** YouTube URL */
  youtube?: EntryFields.Text;
  /** Behance URL */
  behance?: EntryFields.Text;
  /** Copyright text */
  copyrightText: EntryFields.Text;
  /** Footer description */
  footerDescription?: EntryFields.Text;
  /** Quick links */
  quickLinks?: QuickLink[];
  /** Default SEO image */
  defaultImage?: Asset;
  /** SEO keywords */
  keywords?: EntryFields.Text[];
  /** Google Analytics ID */
  googleAnalyticsId?: EntryFields.Text;
}

export interface QuickLink {
  title: string;
  url: string;
  openInNewTab: boolean;
}

export type SiteSettingsEntry = Entry<SiteSettingsFields>;

// Transformed type for component consumption
export interface SiteSettings {
  siteInfo: {
    siteTitle: string;
    siteDescription: string;
    siteLogo: ContentfulImage | null;
    siteUrl: string;
  };
  contactInfo: {
    email: string;
    phone?: string;
    location?: string;
    availability: {
      isAvailable: boolean;
      availabilityMessage?: string;
    };
  };
  socialMedia: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    behance?: string;
  };
  footer: {
    copyrightText: string;
    footerDescription?: string;
    quickLinks?: QuickLink[];
  };
  seo: {
    defaultImage?: ContentfulImage | null;
    keywords?: string[];
    googleAnalyticsId?: string;
  };
}

// ============================================================================
// Gallery Content Type
// ============================================================================

export interface GalleryCollectionFields {
  /** Collection name */
  name: EntryFields.Text;
  /** Collection slug for filtering */
  slug: EntryFields.Text;
  /** Collection description */
  description?: EntryFields.Text;
  /** Photos in this collection */
  photos: Asset[];
  /** Display order */
  order?: EntryFields.Integer;
}

export type GalleryCollectionEntry = Entry<GalleryCollectionFields>;

export interface GalleryCollection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  photos: GalleryPhoto[];
  order: number;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  width: number;
  height: number;
  title: string;
  alt: string;
  blurDataURL?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type ContentfulLocale = 'en-US';

export interface ContentfulError {
  sys: {
    type: 'Error';
    id: string;
  };
  message: string;
  details?: Record<string, unknown>;
}
