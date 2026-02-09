'use client';

/**
 * ContentfulImage Component
 * 
 * A wrapper around Next.js Image optimized for Contentful assets.
 * Features:
 * - Automatic srcset generation for responsive images
 * - Contentful Image API transformations (format, quality, fit)
 * - Blur placeholder support
 * - Fallback handling for missing images
 */

import Image from 'next/image';
import type { ContentfulImage as ContentfulImageType } from '@/types/contentful';

interface ContentfulImageProps {
  /** Contentful image asset */
  image: ContentfulImageType | null | undefined;
  /** Alt text (falls back to image title) */
  alt?: string;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
  /** Fill mode (ignores width/height) */
  fill?: boolean;
  /** CSS class names */
  className?: string;
  /** Object fit style */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Loading priority */
  priority?: boolean;
  /** Image quality (1-100) */
  quality?: number;
  /** Image format */
  format?: 'jpg' | 'png' | 'webp' | 'avif';
  /** Fallback image URL */
  fallback?: string;
  /** Sizes attribute for responsive images */
  sizes?: string;
  /** Additional props passed to Image component */
  imageProps?: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt' | 'width' | 'height' | 'fill'>;
}

/**
 * Build Contentful image URL with transformations
 */
function buildImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    format?: 'jpg' | 'png' | 'webp' | 'avif';
    quality?: number;
    fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
  } = {}
): string {
  const params = new URLSearchParams();

  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (options.format) params.set('fm', options.format);
  if (options.quality) params.set('q', options.quality.toString());
  if (options.fit) params.set('fit', options.fit);

  const queryString = params.toString();
  const baseUrl = url.startsWith('//') ? `https:${url}` : url;
  
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Generate srcset for responsive images
 */
function generateSrcSet(
  url: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920, 2048],
  options: { format?: 'jpg' | 'png' | 'webp' | 'avif'; quality?: number } = {}
): string {
  return widths
    .map((w) => `${buildImageUrl(url, { ...options, width: w })} ${w}w`)
    .join(', ');
}

const DEFAULT_FALLBACK = '/images/placeholder.jpg';

export default function ContentfulImage({
  image,
  alt,
  width,
  height,
  fill = false,
  className = '',
  objectFit = 'cover',
  priority = false,
  quality = 85,
  format = 'webp',
  fallback = DEFAULT_FALLBACK,
  sizes = '100vw',
  imageProps = {},
}: ContentfulImageProps) {
  // Handle missing image
  if (!image?.fields?.file?.url) {
    if (fallback) {
      return (
        <Image
          src={fallback}
          alt={alt || 'Image'}
          width={fill ? undefined : width || 800}
          height={fill ? undefined : height || 600}
          fill={fill}
          className={className}
          style={{ objectFit }}
          priority={priority}
          {...imageProps}
        />
      );
    }
    return null;
  }

  const imageUrl = image.fields.file.url;
  const imageTitle = image.fields.title || 'Image';
  const imageAlt = alt || image.fields.description || imageTitle;
  
  // Get original dimensions
  const originalWidth = image.fields.file.details?.image?.width || 1920;
  const originalHeight = image.fields.file.details?.image?.height || 1080;

  // Calculate dimensions maintaining aspect ratio
  const displayWidth = width || originalWidth;
  const displayHeight = height || Math.round(displayWidth * (originalHeight / originalWidth));

  // Build optimized URL
  const optimizedUrl = buildImageUrl(imageUrl, {
    width: displayWidth,
    format,
    quality,
    fit: 'fill',
  });

  // Generate blur placeholder URL (tiny version)
  const blurUrl = buildImageUrl(imageUrl, {
    width: 10,
    quality: 20,
  });

  return (
    <Image
      src={optimizedUrl}
      alt={imageAlt}
      width={fill ? undefined : displayWidth}
      height={fill ? undefined : displayHeight}
      fill={fill}
      className={className}
      style={{ objectFit }}
      priority={priority}
      sizes={sizes}
      placeholder="blur"
      blurDataURL={blurUrl}
      {...imageProps}
    />
  );
}

/**
 * Helper component for background images from Contentful
 */
export function ContentfulBackgroundImage({
  image,
  className = '',
  children,
  overlay = false,
  fallback = DEFAULT_FALLBACK,
}: {
  image: ContentfulImageType | null | undefined;
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean | string;
  fallback?: string;
}) {
  const imageUrl = image?.fields?.file?.url
    ? buildImageUrl(image.fields.file.url, { width: 1920, format: 'webp', quality: 85 })
    : fallback;

  const overlayClass = overlay === true 
    ? 'bg-black/50' 
    : typeof overlay === 'string' 
      ? overlay 
      : '';

  return (
    <div 
      className={`relative bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {overlay && (
        <div className={`absolute inset-0 ${overlayClass}`} />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Export utility functions
export { buildImageUrl, generateSrcSet };
