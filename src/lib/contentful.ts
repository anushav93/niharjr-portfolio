/**
 * Contentful CMS Client
 * 
 * Enterprise-grade Contentful integration with:
 * - Type-safe content fetching
 * - Image URL optimization
 * - Error handling and logging
 * - Caching strategies
 */

import type {
  Homepage,
  AboutPage,
  SiteSettings,
  GalleryCollection,
  GalleryPhoto,
  ContentfulImage,
  CategoryCard,
  Principle,
  QuickLink,
} from '@/types/contentful';

// ============================================================================
// Environment Validation
// ============================================================================

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

// ============================================================================
// Client Setup
// ============================================================================

let client: any = null;

function getClient(): any | null {
  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    return null;
  }

  if (!client) {
    try {
      // Use require.resolve to get the exact path to the npm package
      // This avoids the issue where 'contentful' resolves to this file
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const contentfulPkg = require('contentful/dist/contentful.node.js');
      const createClient = contentfulPkg.createClient;
      
      if (typeof createClient !== 'function') {
        console.warn('Contentful createClient not found');
        return null;
      }
      
      client = createClient({
        space: CONTENTFUL_SPACE_ID,
        accessToken: CONTENTFUL_ACCESS_TOKEN,
        environment: CONTENTFUL_ENVIRONMENT,
      });
    } catch (error) {
      console.warn('Failed to initialize Contentful client:', error);
      return null;
    }
  }

  return client;
}

// ============================================================================
// Image URL Helpers
// ============================================================================

/**
 * Build an optimized Contentful image URL
 * Supports width, height, format, and quality transformations
 */
export function getImageUrl(
  image: ContentfulImage | null | undefined,
  options: {
    width?: number;
    height?: number;
    format?: 'jpg' | 'png' | 'webp' | 'avif';
    quality?: number;
    fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
  } = {}
): string {
  if (!image?.fields?.file?.url) {
    return '/images/placeholder.jpg';
  }

  let url = `https:${image.fields.file.url}`;
  const params = new URLSearchParams();

  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (options.format) params.set('fm', options.format);
  if (options.quality) params.set('q', options.quality.toString());
  if (options.fit) params.set('fit', options.fit);

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return url;
}

/**
 * Get a responsive srcset for an image
 */
export function getImageSrcSet(
  image: ContentfulImage | null | undefined,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920, 2048],
  options: { format?: 'jpg' | 'png' | 'webp' | 'avif'; quality?: number } = {}
): string {
  if (!image?.fields?.file?.url) {
    return '';
  }

  return widths
    .map((w) => `${getImageUrl(image, { ...options, width: w })} ${w}w`)
    .join(', ');
}

// ============================================================================
// Asset Transformation Helpers
// ============================================================================

function transformAssetToImage(asset: any): ContentfulImage | null {
  if (!asset?.fields?.file) {
    return null;
  }

  return {
    fields: {
      title: asset.fields.title || '',
      description: asset.fields.description,
      file: {
        url: asset.fields.file.url,
        details: asset.fields.file.details,
        fileName: asset.fields.file.fileName,
        contentType: asset.fields.file.contentType,
      },
    },
    sys: {
      id: asset.sys.id,
    },
  };
}

function transformAssetsToImages(assets: any[]): ContentfulImage[] {
  return (assets || [])
    .map(transformAssetToImage)
    .filter((img): img is ContentfulImage => img !== null);
}

// ============================================================================
// Content Fetchers
// ============================================================================

/**
 * Fetch homepage content
 */
export async function getHomepage(): Promise<Homepage | null> {
  try {
    const contentfulClient = getClient();
    if (!contentfulClient) {
      console.log('Contentful client not configured, using fallback');
      return null;
    }

    const entries = await contentfulClient.getEntries({
      content_type: 'homepage',
      limit: 1,
    });

    if (!entries.items.length) {
      return null;
    }

    const entry = entries.items[0];
    const fields = entry.fields as any;

    return {
      hero: {
        tagline: fields.tagline || '',
        title: fields.title || '',
        description: fields.description || '',
        heroImages: transformAssetsToImages(fields.heroImages),
      },
      missionStatement: {
        title: fields.missionTitle || '',
        description: fields.missionDescription || '',
      },
      categories: (fields.categories || []) as CategoryCard[],
      featuredWork: {
        sectionTitle: fields.featuredWorkTitle || '',
        sectionDescription: fields.featuredWorkDescription || '',
        buttonText: fields.featuredWorkButtonText || 'View Gallery',
        featuredImages: transformAssetsToImages(fields.featuredImages),
      },
    };
  } catch (error) {
    console.error('Error fetching homepage from Contentful:', error);
    return null;
  }
}

/**
 * Fetch about page content
 */
export async function getAboutPage(): Promise<AboutPage | null> {
  try {
    const contentfulClient = getClient();
    if (!contentfulClient) {
      return null;
    }

    const entries = await contentfulClient.getEntries({
      content_type: 'aboutPage',
      limit: 1,
    });

    if (!entries.items.length) {
      return null;
    }

    const entry = entries.items[0];
    const fields = entry.fields as any;

    return {
      hero: {
        title: fields.heroTitle || '',
        subtitle: fields.heroSubtitle || '',
      },
      story: {
        portraitImage: transformAssetToImage(fields.portraitImage),
        yearsExperience: fields.yearsExperience || 0,
        mainTitle: fields.mainTitle || '',
        storyParagraphs: fields.storyParagraphs || [],
        skills: fields.skills || [],
      },
      approach: {
        sectionTitle: fields.approachTitle || '',
        sectionDescription: fields.approachDescription || '',
        principles: (fields.principles || []) as Principle[],
      },
      callToAction: {
        title: fields.ctaTitle || '',
        description: fields.ctaDescription || '',
        primaryButtonText: fields.primaryButtonText || 'Get in Touch',
        secondaryButtonText: fields.secondaryButtonText || 'View Work',
      },
    };
  } catch (error) {
    console.error('Error fetching about page from Contentful:', error);
    return null;
  }
}

/**
 * Fetch site settings
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const contentfulClient = getClient();
    if (!contentfulClient) {
      return null;
    }

    const entries = await contentfulClient.getEntries({
      content_type: 'siteSettings',
      limit: 1,
    });

    if (!entries.items.length) {
      return null;
    }

    const entry = entries.items[0];
    const fields = entry.fields as any;

    return {
      siteInfo: {
        siteTitle: fields.siteTitle || '',
        siteDescription: fields.siteDescription || '',
        siteLogo: transformAssetToImage(fields.siteLogo),
        siteUrl: fields.siteUrl || '',
      },
      contactInfo: {
        email: fields.email || '',
        phone: fields.phone,
        location: fields.location,
        availability: {
          isAvailable: fields.isAvailable ?? true,
          availabilityMessage: fields.availabilityMessage,
        },
      },
      socialMedia: {
        instagram: fields.instagram,
        twitter: fields.twitter,
        facebook: fields.facebook,
        linkedin: fields.linkedin,
        youtube: fields.youtube,
        behance: fields.behance,
      },
      footer: {
        copyrightText: fields.copyrightText || `© ${new Date().getFullYear()}`,
        footerDescription: fields.footerDescription,
        quickLinks: (fields.quickLinks || []) as QuickLink[],
      },
      seo: {
        defaultImage: transformAssetToImage(fields.defaultImage),
        keywords: fields.keywords,
        googleAnalyticsId: fields.googleAnalyticsId,
      },
    };
  } catch (error) {
    console.error('Error fetching site settings from Contentful:', error);
    return null;
  }
}

/**
 * Fetch gallery collections with photos
 */
export async function getGalleryCollections(): Promise<GalleryCollection[]> {
  try {
    const contentfulClient = getClient();
    if (!contentfulClient) {
      return [];
    }

    const entries = await contentfulClient.getEntries({
      content_type: 'galleryCollection',
      order: ['fields.order'] as any,
      include: 2, // Include linked assets
    });

    return entries.items.map((entry) => {
      const fields = entry.fields as any;
      const photos = (fields.photos || []).map((asset: any): GalleryPhoto => ({
        id: asset.sys.id,
        url: asset.fields?.file?.url ? `https:${asset.fields.file.url}` : '',
        width: asset.fields?.file?.details?.image?.width || 1920,
        height: asset.fields?.file?.details?.image?.height || 1080,
        title: asset.fields?.title || '',
        alt: asset.fields?.description || asset.fields?.title || '',
      }));

      return {
        id: entry.sys.id,
        name: fields.name || '',
        slug: fields.slug || '',
        description: fields.description,
        photos,
        order: fields.order || 0,
      };
    });
  } catch (error) {
    console.error('Error fetching gallery collections from Contentful:', error);
    return [];
  }
}

/**
 * Fetch all gallery photos (flattened from all collections)
 */
export async function getAllGalleryPhotos(): Promise<GalleryPhoto[]> {
  const collections = await getGalleryCollections();
  return collections.flatMap((collection) => collection.photos);
}

/**
 * Fetch photos by collection slug
 */
export async function getPhotosByCollection(slug: string): Promise<GalleryPhoto[]> {
  const collections = await getGalleryCollections();
  const collection = collections.find((c) => c.slug === slug);
  return collection?.photos || [];
}

// ============================================================================
// Utility Exports
// ============================================================================

export { getClient };
