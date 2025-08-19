import React from "react";
import Typography from "./Typography";
import Button from "./Button";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-neutral-900 text-neutral-900 px-3 py-20">
      <div className="container mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12">
          {/* About Section */}
          <div>
            <Typography variant="h3" className="mb-4">
              Nihar J Reddy
            </Typography>
            <Typography variant="p" className="text-neutral-400">
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
          <p>
            &copy; {new Date().getFullYear()} Nihar J Reddy. All Rights
            Reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Add actual social links here */}
            <a href="#" className="hover:text-white">
              Twitter
            </a>

            <a href="#" className="hover:text-white">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
