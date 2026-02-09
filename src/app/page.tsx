import Link from "next/link";
import { getHomepage, getAllGalleryPhotos, getImageUrl } from "@/lib/contentful";
import type { Homepage } from "@/types/contentful";
import HeroSection from "./components/HeroSection";
import FeaturedSection from "./components/FeaturedSection";
import LatestWorkGrid from "./components/LatestWorkGrid";
import CornerFrameButton from "@/components/CornerFrameButton";

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

// Fallback images if CMS content isn't available
const fallbackImages = [
  { src: "/images/1.jpeg", alt: "Featured Photography 1", title: "Captured Moment" },
  { src: "/images/2.jpeg", alt: "Featured Photography 2", title: "Visual Story" },
  { src: "/images/3.jpeg", alt: "Featured Photography 3", title: "Through the Lens" },
  { src: "/images/4.jpeg", alt: "Featured Photography 4", title: "Light & Shadow" },
  { src: "/images/5.jpeg", alt: "Featured Photography 5", title: "Composition" },
  { src: "/images/6.jpeg", alt: "Featured Photography 6", title: "Perspective" },
  { src: "/images/1.jpeg", alt: "Featured Photography 7", title: "Captured Moment" },
  { src: "/images/2.jpeg", alt: "Featured Photography 8", title: "Visual Story" },
  { src: "/images/3.jpeg", alt: "Featured Photography 9", title: "Through the Lens" },
  { src: "/images/4.jpeg", alt: "Featured Photography 10", title: "Light & Shadow" },
  { src: "/images/5.jpeg", alt: "Featured Photography 11", title: "Composition" },
  { src: "/images/6.jpeg", alt: "Featured Photography 12", title: "Perspective" },
];

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default async function HomePage() {
  // Fetch homepage content
  const homepageData: Homepage | null = await getHomepage();
  const allPhotos = await getAllGalleryPhotos();

  // 1. Featured Section Logic
  let featuredSectionImages: any[] = [];
  
  if (homepageData?.featuredWork?.featuredImages?.length) {
     const shuffled = shuffleArray(homepageData.featuredWork.featuredImages);
     featuredSectionImages = shuffled.slice(0, 3).map(img => ({
        src: getImageUrl(img, { width: 800, height: 1000, format: 'webp', quality: 90 }),
        alt: img.fields.title || 'Featured',
        title: img.fields.title || 'Untitled',
     }));
  } 
  
  if (featuredSectionImages.length === 0 && allPhotos && allPhotos.length > 0) {
      const shuffled = shuffleArray(allPhotos);
      featuredSectionImages = shuffled.slice(0, 3).map(photo => ({
        src: photo.url,
        alt: photo.title || 'Featured',
        title: photo.title || 'Untitled',
      }));
  }

  if (featuredSectionImages.length === 0) {
      featuredSectionImages = shuffleArray(fallbackImages).slice(0, 3);
  }

  // 2. Latest Work Logic
  let galleryImages = fallbackImages;
  
  if (allPhotos && allPhotos.length > 0) {
    galleryImages = allPhotos.slice(0, 12).map((photo) => ({
      src: photo.url,
      alt: photo.alt || photo.title || 'Photography',
      title: photo.title || 'Untitled',
    }));
  }

  const tagline = homepageData?.hero?.tagline || 'NJR';
  const title = homepageData?.hero?.title || 'Visual Storyteller & Photographer';
  const description = homepageData?.hero?.description || 'Capturing authentic moments through the lens';

  return (
    <div className="min-h-screen bg-stone-200">
      <HeroSection 
        tagline={tagline}
        title={title}
        description={description}
      />

      <FeaturedSection images={featuredSectionImages} />

      {/* CTA */}
      <div className="text-center pb-32 px-6">
      <CornerFrameButton href="/gallery">View Full Gallery</CornerFrameButton>
      </div>
    </div>
  );
}
