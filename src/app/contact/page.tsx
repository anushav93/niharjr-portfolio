import React from "react";
import ContactForm from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/contentful";

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

const ContactPage: React.FC = async () => {
  // Fetch site settings from Contentful CMS
  const siteData = await getSiteSettings();

  return (
    <div className="min-h-screen bg-stone-200">
      {/* Contact Header with accent */}
      <div className="relative">
        <div className="absolute top-20 left-0 w-24 h-1 bg-primary-500" />
        
        <div className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
          <div className="inline-block mb-4">
            <p className="text-xs tracking-[0.3em] uppercase text-primary-600 mb-2 font-medium">
              Contact
            </p>
            <div className="h-px w-full bg-primary-400" />
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-text-primary mb-6 leading-tight">
            Get in Touch
          </h1>
          
          <p className="text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {siteData?.contactInfo?.availability?.availabilityMessage || 
              "Available for commissions and collaborations. Let's create something together."}
          </p>
        </div>
      </div>

      {/* Contact Information with cards */}
      {siteData?.contactInfo && (
        <div className="max-w-4xl mx-auto px-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteData.contactInfo.email && (
              <div className="group relative p-6 border border-stone-300 transition-all bg-bg-secondary/50">
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-center">
                  <p className="text-xs tracking-[0.2em] uppercase text-primary-600 mb-3 font-medium">
                    Email
                  </p>
                  <a 
                    href={`mailto:${siteData.contactInfo.email}`}
                    className="text-sm text-text-primary hover:text-primary-600 transition-colors break-all"
                  >
                    {siteData.contactInfo.email}
                  </a>
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
            
            {siteData.contactInfo.phone && (
              <div className="group relative p-6 border border-stone-300 transition-all bg-bg-secondary/50">
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-center">
                  <p className="text-xs tracking-[0.2em] uppercase text-primary-600 mb-3 font-medium">
                    Phone
                  </p>
                  <a 
                    href={`tel:${siteData.contactInfo.phone}`}
                    className="text-sm text-text-primary hover:text-primary-600 transition-colors"
                  >
                    {siteData.contactInfo.phone}
                  </a>
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
            
            {siteData.contactInfo.location && (
              <div className="group relative p-6 border border-stone-300 transition-all bg-bg-secondary/50">
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-center">
                  <p className="text-xs tracking-[0.2em] uppercase text-primary-600 mb-3 font-medium">
                    Location
                  </p>
                  <p className="text-sm text-text-secondary">
                    {siteData.contactInfo.location}
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage;
