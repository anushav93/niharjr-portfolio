'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { QuickLink } from '@/types/contentful';
import SiteLogo from '@/components/layout/SiteLogo';

type NavbarProps = {
  links: QuickLink[];
  logoUrl: string;
  logoAlt: string;
};

export default function Navbar({ links, logoUrl, logoAlt }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="border-b border-b-stone-300 fixed top-0 left-0 right-0 z-50 w-full px-6 lg:px-8 h-24 flex items-center justify-between bg-page transition-all duration-300" aria-label="Main navigation">
      <Link href="/" className="flex items-center group">
        {logoUrl && (
          <SiteLogo
            src={logoUrl}
            alt={logoAlt}
            priority
            className="h-10 w-auto transition-all duration-300 group-hover:brightness-110"
          />
        )}
      </Link>

      <ul className="hidden md:flex items-center gap-10">
        {links.map((item) => (
          <li key={item.url}>
            <Link href={item.url} className="relative group" aria-current={isActive(item.url) ? 'page' : undefined}>
              <span
                className={`text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 ${
                  isActive(item.url) ? 'text-primary-600' : 'text-subtext group-hover:text-primary-600'
                }`}
              >
                {item.title}
              </span>
              {isActive(item.url) ? (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600" aria-hidden="true" />
              ) : (
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" aria-hidden="true" />
              )}
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 z-50 relative"
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-navigation"
      >
        <span className={`w-6 h-0.5 bg-stone-500 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} aria-hidden="true" />
        <span className={`w-6 h-0.5 bg-stone-500 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} aria-hidden="true" />
        <span className={`w-6 h-0.5 bg-stone-500 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} aria-hidden="true" />
      </button>

      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-40 bg-gradient-to-b from-page from-60% via-page/95 to-transparent backdrop-blur-lg transition-opacity duration-500 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex items-center justify-center h-full">
          <ul className="flex flex-col items-center gap-8">
            {links.map((item) => (
              <li key={item.url}>
                <Link
                  href={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative group"
                  aria-current={isActive(item.url) ? 'page' : undefined}
                >
                  <span
                    className={`text-2xl tracking-[0.2em] uppercase font-medium transition-all ${
                      isActive(item.url) ? 'text-primary-600' : 'text-foreground group-hover:text-primary-600'
                    }`}
                  >
                    {item.title}
                  </span>
                  {isActive(item.url) && (
                    <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary-500" aria-hidden="true" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
