import './globals.css';
import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import ClarityScript from '@/components/analytics/ClarityScript';
import CookieConsent from '@/components/analytics/CookieConsent';
import SkipLink from '@/components/layout/SkipLink';
import { getSiteMetadataDefaults } from '@/lib/metadata';
import { getEntry, imageUrl } from '@/lib/contentful';
import { CONTENTFUL_ENTRIES } from '@/config/contentful';
import type { SiteSettingsFields } from '@/types/contentful';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: true,
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  adjustFontFallback: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const { siteTitle, siteDescription, siteUrl, ogImage } = await getSiteMetadataDefaults();
  const entry = await getEntry<SiteSettingsFields>(CONTENTFUL_ENTRIES.siteSettings, { include: 1 });
  const keywords = entry?.fields?.keywords;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    keywords,
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: siteUrl,
      locale: 'en_US',
      type: 'website',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: siteTitle }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const entry = await getEntry<SiteSettingsFields>(CONTENTFUL_ENTRIES.siteSettings, { include: 1 });
  const siteSettings = entry?.fields ?? null;
  const clarityId = siteSettings?.clarityProjectId;
  const logoUrl = siteSettings?.siteLogo
    ? imageUrl(siteSettings.siteLogo)
    : '/logo-main.svg';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <SkipLink />
        {clarityId && <ClarityScript clarityId={clarityId} />}
        <Providers>
          <ConditionalLayout siteSettings={siteSettings} logoUrl={logoUrl}>
            {children}
          </ConditionalLayout>
        </Providers>
        <CookieConsent />
      </body>
    </html>
  );
}
