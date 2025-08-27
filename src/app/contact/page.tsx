import React from "react";
import Typography from "@/components/Typography";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/sanity";

// Force revalidation on every request
export const revalidate = 0;

const ContactPage: React.FC = async () => {
  // Fetch site settings from Sanity CMS
  const siteData = await getSiteSettings();

  return (
    <div className="pt-12">
      <Container>
        <div className="text-center py-20">
          <Typography
            variant="small"
            className="mb-6 uppercase px-2 py-1 bg-blue-500 text-white rounded-full"
          >
            Contact Me
          </Typography>
          <Typography variant="h1" fontWeight="light" className="mt-8">
            Get in Touch
          </Typography>
          <Typography variant="p" className="max-w-2xl mx-auto mt-4">
            {siteData?.contactInfo?.availability?.availabilityMessage || 
              "I'm always excited to connect with new people. Whether you have a question, a project proposal, or just want to say hello, feel free to reach out."}
          </Typography>

          {/* <div className="mt-6 px-4 py-2 w-fit bg-green-500 animate-pulse text-white rounded-full mx-auto">
            <Typography variant="small" className="mb-2 text-white">
              Available for new projects
            </Typography> 
          </div> */}
        </div>
        
        {/* Contact Information from CMS */}
        {/* {siteData?.contactInfo && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
              {siteData.contactInfo.email && (
                <div className="p-6 border border-neutral-200 rounded-lg">
                  <Typography variant="h4" className="mb-2">Email</Typography>
                  <Typography variant="p" className="text-blue-600">
                    <a href={`mailto:${siteData.contactInfo.email}`}>
                      {siteData.contactInfo.email}
                    </a>
                  </Typography>
                </div>
              )}
              {siteData.contactInfo.phone && (
                <div className="p-6 border border-neutral-200 rounded-lg">
                  <Typography variant="h4" className="mb-2">Phone</Typography>
                  <Typography variant="p" className="text-blue-600">
                    <a href={`tel:${siteData.contactInfo.phone}`}>
                      {siteData.contactInfo.phone}
                    </a>
                  </Typography>
                </div>
              )}
              {siteData.contactInfo.location && (
                <div className="p-6 border border-neutral-200 rounded-lg">
                  <Typography variant="h4" className="mb-2">Location</Typography>
                  <Typography variant="p">{siteData.contactInfo.location}</Typography>
                </div>
              )}
              {siteData.contactInfo.availability && (
                <div className="p-6 border border-neutral-200 rounded-lg">
                  <Typography variant="h4" className="mb-2">Availability</Typography>
                  <Typography variant="p" className={siteData.contactInfo.availability.isAvailable ? "text-green-600" : "text-red-600"}>
                    {siteData.contactInfo.availability.isAvailable ? "Available for new projects" : "Currently booked"}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        )} */}
        
        <div className="max-w-2xl mx-auto pb-20">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
