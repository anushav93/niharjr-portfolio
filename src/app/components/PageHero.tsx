import React from "react";
import AnimatedImageStack from "./AnimatedImageStack";
import Button from "@/components/Button";
import Typography from "@/components/Typography";

type HeroPhoto = {
  src: string;
};

type PageHeroProps = {
  photos: HeroPhoto[];
  tagline?: string;
  title?: string;
  description?: string;
};

export default function PageHero({ photos, tagline, title, description }: PageHeroProps) {
  const imageUrls = photos.map((p) => p.src);

  return (
    <div className="">
      <section className="w-full flex items-center py-12">
        <div className="w-full">
          <div className="grid grid-cols-1 items-center">
            <div className="">
              <div className="text-center">
                <Typography
                  variant="small"
                  className="mb-6 uppercase px-2 py-1 bg-secondary-500 text-white rounded-full"
                >
                  {tagline || 'VISUAL STORYTELLER'}
                </Typography>
                <Typography
                  variant="h1"
                  className="font-light tracking-tighter mb-4 mt-8"
                >
                  {title || 'NIHAR J REDDY'}
                </Typography>
                <Typography
                  variant="p"
                  className="mx-auto md:mx-0 text-lg sm:text-xl text-text-secondary mb-8"
                >
                  {description || 'Capturing authentic moments and creating compelling narratives through the lens'}
                </Typography>
              </div>
              <AnimatedImageStack
                images={imageUrls}
                rows={3}
                cols={5}
                lensRadius={170}
                speed={20}
              />
            </div>
          </div>
        </div>
      </section>
      <div className="flex flex-row justify-center md:justify-start">
        <Button
          href="/gallery"
          variant="light"
          className="w-full sm:w-auto flex-1"
        >
          View Gallery
        </Button>
        <Button
          href="/contact"
          variant="dark"
          className="w-full sm:w-auto flex-1"
        >
          Get in touch
        </Button>
      </div>
    </div>
  );
}
