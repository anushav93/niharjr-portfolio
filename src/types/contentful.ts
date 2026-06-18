/**
 * Contentful field types — flat, matching CMS content models.
 */

import type { Asset, Entry, EntryFields } from 'contentful';

export interface Photo {
  id: string;
  url: string;
  alt: string;
  title: string;
  width: number;
  height: number;
}

export interface QuickLink {
  title: string;
  url: string;
  openInNewTab: boolean;
}

export interface Certificate {
  title: string;
  filePath: string;
}

export interface Principle {
  icon: string;
  title: string;
  description: string;
}

export interface HomepageFields {
  tagline: EntryFields.Text;
  title: EntryFields.Text;
  description?: EntryFields.Text;
  recentProjects?: Entry<RecentProjectFields>[];
  recentSectionTitle?: EntryFields.Text;
  galleryCtaText?: EntryFields.Text;
}

export interface RecentProjectFields {
  title: EntryFields.Text;
  url: EntryFields.Text;
  assets?: Asset[];
}

export interface AboutPageFields {
  pageEyebrow?: EntryFields.Text;
  heroTitle: EntryFields.Text;
  heroSubtitle?: EntryFields.Text;
  portraitImage?: Asset;
  yearsExperience?: EntryFields.Integer;
  mainTitle?: EntryFields.Text;
  storyParagraphs?: EntryFields.Text[];
  skills?: EntryFields.Text[];
  approachTitle?: EntryFields.Text;
  approachDescription?: EntryFields.Text;
  principles?: Principle[];
  ctaTitle?: EntryFields.Text;
  ctaDescription?: EntryFields.Text;
  primaryButtonText?: EntryFields.Text;
  secondaryButtonText?: EntryFields.Text;
}

export interface AboutPageV2Fields {
  eyebrow?: EntryFields.Text;
  mainTitle: EntryFields.Text;
  subTitle?: EntryFields.Text;
  introTitle?: EntryFields.Text;
  introParagraphs?: EntryFields.Text[];
  skills?: EntryFields.Text[];
  approachTitle?: EntryFields.Text;
  approachDescription?: EntryFields.Text;
  principles?: Principle[];
  ctaTitle?: EntryFields.Text;
  ctaDesc?: EntryFields.Text;
  primaryCTAText?: EntryFields.Text;
  secondaryCTAText?: EntryFields.Text;
  introImage?: Asset;
}

export interface GalleryPageFields {
  pageEyebrow?: EntryFields.Text;
  pageTitle: EntryFields.Text;
  pageSubtitle?: EntryFields.Text;
}

export interface ContactPageFields {
  pageEyebrow?: EntryFields.Text;
  pageTitle: EntryFields.Text;
  pageSubtitle?: EntryFields.Text;
}

export interface SiteSettingsFields {
  siteTitle: EntryFields.Text;
  siteDescription?: EntryFields.Text;
  siteLogo?: Asset;
  siteUrl?: EntryFields.Text;
  email: EntryFields.Text;
  phone?: EntryFields.Text;
  location?: EntryFields.Text;
  isAvailable?: EntryFields.Boolean;
  availabilityMessage?: EntryFields.Text;
  instagram?: EntryFields.Text;
  twitter?: EntryFields.Text;
  facebook?: EntryFields.Text;
  linkedin?: EntryFields.Text;
  youtube?: EntryFields.Text;
  behance?: EntryFields.Text;
  copyrightText?: EntryFields.Text;
  footerDescription?: EntryFields.Text;
  quickLinks?: QuickLink[];
  defaultImage?: Asset;
  keywords?: EntryFields.Text[];
  googleAnalyticsId?: EntryFields.Text;
  clarityProjectId?: EntryFields.Text;
  recentProjectEyebrow?: EntryFields.Text;
  certificatesTitle?: EntryFields.Text;
  certificatesDescription?: EntryFields.Text;
  certificates?: Certificate[];
  brandName?: EntryFields.Text;
  contactCtaText?: EntryFields.Text;
  galleryPageEyebrow?: EntryFields.Text;
  galleryPageTitle?: EntryFields.Text;
  galleryPageSubtitle?: EntryFields.Text;
  contactPageEyebrow?: EntryFields.Text;
  contactPageTitle?: EntryFields.Text;
  contactPageSubtitle?: EntryFields.Text;
}

export interface GalleryCollectionFields {
  name: EntryFields.Text;
  slug: EntryFields.Text;
  description?: EntryFields.Text;
  photos?: Asset[];
  order?: EntryFields.Integer;
}

export type HomepageEntry = Entry<HomepageFields>;
export type RecentProjectEntry = Entry<RecentProjectFields>;
export type AboutPageEntry = Entry<AboutPageFields>;
export type GalleryPageEntry = Entry<GalleryPageFields>;
export type ContactPageEntry = Entry<ContactPageFields>;
export type SiteSettingsEntry = Entry<SiteSettingsFields>;
export type GalleryCollectionEntry = Entry<GalleryCollectionFields>;
