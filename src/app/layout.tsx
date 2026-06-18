import './globals.css';
import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { getEntry, imageUrl } from '@/lib/contentful';
import { CONTENTFUL_ENTRIES } from '@/config/contentful';
import type { SiteSettingsFields } from '@/types/contentful';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export async function generateMetadata(): Promise<Metadata> {
  const entry = await getEntry<SiteSettingsFields>(CONTENTFUL_ENTRIES.siteSettings, { include: 1 });
  const fields = entry?.fields;

  const title = fields?.siteTitle || 'Nihar J Reddy Photography';
  const description = fields?.siteDescription || '';
  const siteUrl = fields?.siteUrl || 'https://www.negativereel.com';
  const ogImage = fields?.defaultImage
    ? imageUrl(fields.defaultImage, { width: 1200, height: 630, fit: 'fill', format: 'webp' })
    : undefined;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    keywords: fields?.keywords,
    openGraph: {
      title,
      description,
      url: siteUrl,
      locale: 'en_US',
      type: 'website',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
      <head>
        {clarityId && (
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityId}");
              `,
            }}
          />
        )}
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Providers>
          <ConditionalLayout siteSettings={siteSettings} logoUrl={logoUrl}>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
