'use client'

import React, { useEffect, useState } from "react";
import Typography from "./Typography";
import Button from "./Button";
import { getSiteSettings } from "@/lib/sanity";

const Footer: React.FC = () => {
  const [siteData, setSiteData] = useState<any>(null);

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
    <footer className="w-full border-t border-neutral-900 text-neutral-900 px-3 py-20">
      <div className="container mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12">
          {/* About Section */}
          <div>
            <img
              src="/logo.svg"
              alt="Nihar J Reddy"
              className="h-12 lg:h-20 w-auto"
            />
            <Typography variant="p" className="text-neutral-500">
              Visual storyteller capturing authentic moments and creating
              compelling narratives through the lens.
            </Typography>
          </div>

          {/* Navigation and Socials */}
          <div>
            <Typography variant="h4" className="mb-4">
              Explore
            </Typography>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-blue-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  className="hover:text-blue-500 transition-colors"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-blue-500 transition-colors"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <Typography variant="h4" className="mb-4">
              Let&apos;s Connect
            </Typography>
            <Typography variant="p" className="text-neutral-400 mb-4">
              Have a project in mind or just want to say hello?
            </Typography>
            <Button href="/contact" variant="light">
              Get in Touch
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
          <p className="font-mono text-neutral-400">
            {siteData?.footer?.copyrightText || `&copy; ${new Date().getFullYear()} Nihar J Reddy. All Rights Reserved.`}
          </p>
          
          {/* Social Media Links from CMS */}
          {siteData?.socialMedia && (
            <div className="flex space-x-4 mt-4 md:mt-0">
              {siteData.socialMedia.instagram && (
                <a 
                  href={siteData.socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors"
                >
                  Instagram
                </a>
              )}
              {siteData.socialMedia.twitter && (
                <a 
                  href={siteData.socialMedia.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors"
                >
                  Twitter
                </a>
              )}
              {siteData.socialMedia.linkedin && (
                <a 
                  href={siteData.socialMedia.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {siteData.socialMedia.facebook && (
                <a 
                  href={siteData.socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors"
                >
                  Facebook
                </a>
              )}
              {siteData.socialMedia.behance && (
                <a 
                  href={siteData.socialMedia.behance} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors"
                >
                  Behance
                </a>
              )}
              {siteData.socialMedia.youtube && (
                <a 
                  href={siteData.socialMedia.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors"
                >
                  YouTube
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
