import { getHomepage } from "@/lib/contentful";
import type { Homepage } from "@/types/contentful";
import HeroSection from "./components/HeroSection";
import FeaturedSection from "./components/FeaturedSection";
import CornerFrameButton from "@/components/CornerFrameButton";

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

// Helper to get a random item from array
function getRandomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

export default async function HomePage() {
  // Fetch homepage content
  const homepageData: Homepage | null = await getHomepage();

  // Transform recent projects for FeaturedSection
  // Each project displays a random image from its assets
  const recentProjectsForDisplay = (homepageData?.recentProjects || [])
    .filter(project => project.assets.length > 0)
    .map(project => {
      const randomAsset = getRandomItem(project.assets);
      return {
        src: randomAsset ? `${randomAsset.url}?w=800&h=1000&fit=fill&fm=webp&q=90` : '',
        alt: randomAsset?.alt || project.title,
        title: project.title,
        href: `/recent/${project.url}`,
      };
    });

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

      {recentProjectsForDisplay.length > 0 && (
        <FeaturedSection projects={recentProjectsForDisplay} />
      )}

      {/* CTA */}
      <div className="text-center pb-32 px-6">
        <CornerFrameButton href="/gallery">View Full Gallery</CornerFrameButton>
      </div>
    </div>
  );
}
