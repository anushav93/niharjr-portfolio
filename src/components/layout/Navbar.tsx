'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { QuickLink } from '@/types/contentful';

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
    <nav className="border-b border-b-stone-300 fixed top-0 left-0 right-0 z-50 w-full px-6 lg:px-8 h-24 flex items-center justify-between bg-[#f5e9df] transition-all duration-300">
      <Link href="/" className="flex items-center relative group">
        {logoUrl && (
          <Image
            src={logoUrl}
            alt={logoAlt}
            width={120}
            height={40}
            className="h-10 w-auto transition-all duration-300 group-hover:brightness-110"
            priority
          />
        )}
        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
      </Link>

      <ul className="hidden md:flex items-center gap-10">
        {links.map((item) => (
          <li key={item.url}>
            <Link href={item.url} className="relative group">
              <span
                className={`text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 ${
                  isActive(item.url) ? 'text-primary-600' : 'text-text-secondary group-hover:text-primary-600'
                }`}
              >
                {item.title}
              </span>
              {isActive(item.url) ? (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600" />
              ) : (
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
              )}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 z-50 relative"
        aria-label="Toggle menu"
      >
        <span className={`w-6 h-0.5 bg-stone-500 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`w-6 h-0.5 bg-stone-500 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
        <span className={`w-6 h-0.5 bg-stone-500 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      <div
        className={`fixed inset-0 z-40 bg-[#f5e9df]/80 backdrop-blur-lg transition-opacity duration-500 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <ul className="flex flex-col items-center gap-8">
            {links.map((item) => (
              <li key={item.url}>
                <Link href={item.url} onClick={() => setMobileMenuOpen(false)} className="relative group">
                  <span
                    className={`text-2xl tracking-[0.2em] uppercase font-medium transition-all ${
                      isActive(item.url) ? 'text-primary-600' : 'text-text-primary group-hover:text-primary-600'
                    }`}
                  >
                    {item.title}
                  </span>
                  {isActive(item.url) && (
                    <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary-500" />
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
