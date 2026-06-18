/** Client-safe image URL helpers (no Contentful SDK). */

export function buildImageUrl(
  rawUrl: string,
  options: {
    width?: number;
    height?: number;
    format?: 'jpg' | 'png' | 'webp' | 'avif';
    quality?: number;
    fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
  } = {}
): string {
  if (!rawUrl) return '';

  let url = rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl;
  const params = new URLSearchParams();

  if (options.width) params.set('w', String(options.width));
  if (options.height) params.set('h', String(options.height));
  if (options.format) params.set('fm', options.format);
  if (options.quality) params.set('q', String(options.quality));
  if (options.fit) params.set('fit', options.fit);

  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

export function photoSrc(photo: { url: string }, width: number, quality = 80): string {
  const base = photo.url.split('?')[0];
  return `${base}?w=${width}&fm=webp&q=${quality}`;
}
