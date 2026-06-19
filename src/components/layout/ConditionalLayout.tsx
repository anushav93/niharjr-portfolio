'use client';

import { usePathname } from 'next/navigation';
import type { SiteSettingsFields } from '@/types/contentful';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
  siteSettings: SiteSettingsFields | null;
  logoUrl: string;
}

export default function ConditionalLayout({ children, siteSettings, logoUrl }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar
        links={siteSettings?.quickLinks ?? []}
        logoUrl={logoUrl}
        logoAlt={siteSettings?.brandName || siteSettings?.siteTitle || 'Home'}
      />
      <main id="main">{children}</main>
      <Footer siteSettings={siteSettings} logoUrl={logoUrl} />
    </>
  );
}
