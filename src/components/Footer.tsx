'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/contentful";
import type { SiteSettings } from "@/types/contentful";
import dynamic from "next/dynamic";

const PDFModal = dynamic(() => import("./PDFModal"), {
  ssr: false,
});

const certificates = [
  {
    title: "Digital Cinematography",
    file: "/certificates/digital-cinematography.pdf",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "Wedding Photography",
    file: "/certificates/wedding-photography-certificate.pdf",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

const Footer: React.FC = () => {
  const [siteData, setSiteData] = useState<SiteSettings | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const data = await getSiteSettings();
        setSiteData(data);
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSiteData();
  }, []);

  return (
    <footer className="w-full  bg-stone-200">
      {/* Accent line */}
      <div className="w-full h-1 " />
      
      <div className="px-6 md:px-12 py-16 ">
        <div className="mx-auto">
          
          {/* Certificates Section - Highlighted */}
          <div className="mb-16 border border-stone-300 p-8 bg-stone-300">
            <div className="text-center mb-6">
              <h3 className="text-xs tracking-[0.3em] uppercase text-primary-600 font-medium mb-2">
                Certified Professional
              </h3>
              <div className="h-px w-24 bg-primary-400 mx-auto mb-4" />
              <p className="text-sm text-text-secondary">
                Recognized qualifications in cinematography and photography
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {certificates.map((cert) => (
                <button
                  key={cert.title}
                  onClick={() => setSelectedPdf({ url: cert.file, title: cert.title })}
                  className="group relative flex items-center gap-4 p-4 border border-stone-500 hover:border-primary-400 bg-bg-primary transition-all text-left w-full"
                >
                  {/* Corner frames */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-100 text-primary-600 group-hover:bg-primary-200 transition-colors">
                    {cert.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary group-hover:text-primary-600 transition-colors truncate">
                      {cert.title}
                    </p>
                    <p className="text-xs text-text-muted">
                      View Certificate
                    </p>
                  </div>
                  
                  <svg 
                    className="w-4 h-4 text-primary-500 flex-shrink-0 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <Image
                src="/logo.png"
                alt="NEGA+IVE"
                width={120}
                height={40}
                className="h-10 w-auto mb-6"
              />
              <p className="text-sm text-text-secondary leading-relaxed max-w-md">
                Visual storytelling through photography. Capturing authentic moments
                and creating compelling narratives through the lens.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-primary-600 mb-4 font-medium">
                Navigate
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Home", href: "/" },
                  { name: "Gallery", href: "/gallery" },
                  { name: "About", href: "/about" },
                  { name: "Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary-600 transition-colors"
                    >
                      <span className="w-0 h-px bg-primary-500 group-hover:w-4 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-primary-600 mb-4 font-medium">
                Connect
              </h4>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors mb-6 font-medium"
              >
                Get in Touch
                <svg 
                  className="w-3 h-3 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              {/* Social Links */}
              <div className="flex flex-col gap-3">
                <a 
                  href="https://www.instagram.com/negative_r5/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-xs text-text-secondary hover:text-primary-600 transition-colors"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
                {siteData?.socialMedia?.twitter && (
                  <a 
                    href={siteData.socialMedia.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-xs text-text-secondary hover:text-primary-600 transition-colors"
                  >
                    <span className="w-0 h-px bg-primary-500 group-hover:w-4 transition-all" />
                    Twitter
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border-default pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-text-muted">
              {siteData?.footer?.copyrightText || `© ${new Date().getFullYear()} All Rights Reserved`}
            </p>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-primary-400" />
              <p className="text-xs tracking-[0.3em] uppercase text-primary-600 font-medium">
                NEGA+IVE
              </p>
              <div className="w-8 h-px bg-primary-400" />
            </div>
          </div>
        </div>
      </div>

      <PDFModal 
        isOpen={!!selectedPdf} 
        onClose={() => setSelectedPdf(null)} 
        pdfUrl={selectedPdf?.url || ""} 
        title={selectedPdf?.title} 
      />
    </footer>
  );
};

export default Footer;
