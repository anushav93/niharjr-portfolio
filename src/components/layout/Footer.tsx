'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { SiteSettingsFields } from '@/types/contentful';
import CornerFrameCard from '@/components/ui/CornerFrameCard';
import SiteLogo from '@/components/layout/SiteLogo';
import {FaInstagram } from 'react-icons/fa';
import { FaRegEnvelope } from "react-icons/fa";
const PDFModal = dynamic(() => import('@/components/PDFModal'), { ssr: false });

type FooterProps = {
  siteSettings: SiteSettingsFields | null;
  logoUrl: string;
};

const CERT_ICONS = [
  <svg key="video" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>,
  <svg key="camera" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>,
];

export default function Footer({ siteSettings, logoUrl }: FooterProps) {
  const [selectedPdf, setSelectedPdf] = useState<{ url: string; title: string } | null>(null);

  if (!siteSettings) return null;

  const links = siteSettings.quickLinks ?? [];
  const certificates = siteSettings.certificates ?? [];

  const socialLinks = [
    { label: 'Instagram', url: siteSettings.instagram, icon: FaInstagram },
    { label: 'Twitter', url: siteSettings.twitter },
    { label: 'Facebook', url: siteSettings.facebook },
    { label: 'LinkedIn', url: siteSettings.linkedin },
    { label: 'YouTube', url: siteSettings.youtube },
    { label: 'Behance', url: siteSettings.behance },
  ].filter((s) => s.url);

  return (
    <footer className="w-full bg-page">
      <div className="px-6 md:px-12 py-16">
        <div className="mx-auto">
          {certificates.length > 0 && siteSettings.certificatesTitle && (
            <section className="mb-16 border border-stone-300 p-8 bg-surface-muted" aria-labelledby="certificates-heading">
              <div className="text-center mb-6">
                <h2
                  id="certificates-heading"
                  className="text-xs tracking-[0.3em] uppercase text-primary-600 font-medium mb-2"
                >
                  {siteSettings.certificatesTitle}
                </h2>
                <div className="h-px w-24 bg-primary-400 mx-auto mb-4" />
                {siteSettings.certificatesDescription && (
                  <p className="text-sm text-subtext">{siteSettings.certificatesDescription}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {certificates.map((cert, i) => (
                  <CornerFrameCard
                    key={cert.title}
                    cornerSize="sm"
                    frameColor="border-primary-700"
                    onClick={() => setSelectedPdf({ url: cert.filePath, title: cert.title })}
                    className="flex items-center gap-4 p-4 border border-stone-500 hover:border-primary-700 bg-page hover:bg-primary-100 hover:shadow-sm transition-all text-left w-full"
                  >
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-100 text-primary-600">
                      {CERT_ICONS[i % CERT_ICONS.length]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{cert.title}</p>
                      <p className="text-xs text-subtle">View Certificate</p>
                    </div>
                  </CornerFrameCard>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              {logoUrl && (
                <SiteLogo
                  src={logoUrl}
                  alt={siteSettings.brandName || siteSettings.siteTitle || 'Site logo'}
                  className="h-10 w-auto mb-6"
                />
              )}
              {siteSettings.footerDescription && (
                <p className="text-sm text-subtext leading-relaxed max-w-md">
                  {siteSettings.footerDescription}
                </p>
              )}
            </div>

            {links.length > 0 && (
              <nav aria-labelledby="footer-nav-heading">
                <h2 id="footer-nav-heading" className="text-xs tracking-[0.2em] uppercase text-primary-600 mb-4 font-medium">
                  Navigate
                </h2>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.url}>
                      <Link
                        href={link.url}
                        className="group inline-flex items-center gap-1.5 text-sm text-subtext hover:text-primary-600 transition-colors"
                      >
                        <span className="inline-block h-0.5 w-0 shrink-0 bg-primary-500 transition-all duration-300 group-hover:w-4" />
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <nav aria-labelledby="footer-connect-heading" className={links.length > 0 ? undefined : 'md:col-span-2'}>
              <h2 id="footer-connect-heading" className="text-xs tracking-[0.2em] uppercase text-primary-600 mb-4 font-medium">
                Connect
              </h2>
              <ul className="space-y-3">
                {siteSettings.contactCtaText && (
                  <li>
                    <Link
                      href="/contact"
                      className="group inline-flex items-center gap-1.5 text-sm text-subtext hover:text-primary-600 transition-colors"
                    >
                      <span className="inline-block h-0.5 w-0 shrink-0 bg-primary-500 transition-all duration-300 group-hover:w-4" />
                      <FaRegEnvelope className="w-4 h-4 shrink-0 text-primary-600" />
                      {siteSettings.contactCtaText}
                    </Link>
                  </li>
                )}
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm text-subtext hover:text-primary-600 transition-colors"
                    >
                      <span className="inline-block h-0.5 w-0 shrink-0 bg-primary-500 transition-all duration-300 group-hover:w-4" />
                      {social.icon && <social.icon className="w-4 h-4 shrink-0 text-primary-600" />}
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="border-t border-border-default pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            {siteSettings.copyrightText && (
              <p className="text-xs text-subtle">{siteSettings.copyrightText}</p>
            )}
            {siteSettings.brandName && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-primary-400" />
                <p className="text-xs tracking-[0.3em] uppercase text-primary-600 font-medium">
                  {siteSettings.brandName}
                </p>
                <div className="w-8 h-px bg-primary-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      <PDFModal
        isOpen={!!selectedPdf}
        onClose={() => setSelectedPdf(null)}
        pdfUrl={selectedPdf?.url || ''}
        title={selectedPdf?.title}
      />
    </footer>
  );
}
