import Image from 'next/image';

type SiteLogoProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

export default function SiteLogo({
  src,
  alt,
  priority = false,
  className = 'h-10 w-auto',
}: SiteLogoProps) {
  const isSvg = src.endsWith('.svg');

  if (isSvg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        fetchPriority={priority ? 'high' : undefined}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={120}
      height={40}
      priority={priority}
      className={className}
      style={{ width: 'auto', height: '2.5rem' }}
    />
  );
}
