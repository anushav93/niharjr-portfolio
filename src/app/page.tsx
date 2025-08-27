import Container from "@/components/Container";
import PageHero from "./components/PageHero";
import SectionHeading from "./components/SectionHeading";
import PhotoCard from "./components/PhotoCard";
import Typography from "@/components/Typography";
import Button from "@/components/Button";
import { getHomepage, urlFor } from "@/lib/sanity";
import type { Homepage } from "@/lib/sanity";

// Force revalidation on every request
export const revalidate = 0;

// Fallback images if CMS content isn't available
const fallbackHeroPhotos = [
  { src: "/images/1.jpeg", alt: "Featured 1" },
  { src: "/images/2.jpeg", alt: "Featured 2" },
  { src: "/images/3.jpeg", alt: "Featured 3" },
  { src: "/images/4.jpeg", alt: "Featured 4" },
  { src: "/images/5.jpeg", alt: "Featured 5" },
  { src: "/images/6.jpeg", alt: "Featured 6" },
];

export default async function HomePage() {
  // Fetch homepage content from Sanity CMS with no caching
  const homepageData: Homepage | null = await getHomepage();
  


  // Transform hero images from CMS or use fallback
  const heroPhotos = homepageData?.hero?.heroImages?.length 
    ? homepageData.hero.heroImages.map((img: any, index: number) => ({
        src: img ? urlFor(img).width(800).height(600).url() : fallbackHeroPhotos[index]?.src,
        alt: `Hero image ${index + 1}`
      }))
    : fallbackHeroPhotos;

  // Transform featured work images from CMS or use fallback
  const featuredImages = homepageData?.featuredWork?.featuredImages?.length 
    ? homepageData.featuredWork.featuredImages.map((img: any, index: number) => ({
        src: img ? urlFor(img).width(800).height(600).url() : fallbackHeroPhotos[index]?.src,
        alt: `Featured work ${index + 1}`
      }))
    : fallbackHeroPhotos;


  // Use CMS data or fallback content
  const content = {
    hero: {
      tagline: homepageData?.hero?.tagline || 'VISUAL STORYTELLER',
      title: homepageData?.hero?.title || 'NIHAR J REDDY',
      description: homepageData?.hero?.description || 'Capturing authentic moments and creating compelling narratives through the lens'
    },
    missionStatement: {
      title: homepageData?.missionStatement?.title || 'Every Frame Tells a Story',
      description: homepageData?.missionStatement?.description || 'Through my lens, I capture the extraordinary in the ordinary, creating visual narratives that resonate with emotion and authenticity.'
    },
    categories: homepageData?.categories || [
      {
        label: "NATURE",
        title: "Landscapes", 
        description: "Capturing the raw beauty and serene moments found in natural environments, from mountains to coastlines.",
        galleryFilter: "Nature+and+the+Landscapes",
      },
      {
        label: "CONSTRUCTION SITE",
        title: "People",
        description: "A collection of portraits and candid moments that tell the stories of individuals from diverse backgrounds.",
        galleryFilter: "Construction+Site",
      },
      {
        label: "HEARTS",
        title: "Melting hearts", 
        description: "A series focused on capturing intimate and heartfelt connections between people.",
        galleryFilter: "Melting+Hearts",
      },
    ],
    featuredWork: {
      sectionTitle: homepageData?.featuredWork?.sectionTitle || 'Latest Captures',
      sectionDescription: homepageData?.featuredWork?.sectionDescription || 'A curated selection of my most recent work, showcasing diverse styles and subjects.',
      buttonText: homepageData?.featuredWork?.buttonText || 'View All Work'
    }
  };

  return (
    <div className="pt-20">

      
      {/* Hero Section with CMS content */}
      <section className="">
        <PageHero 
          photos={heroPhotos}
          tagline={content.hero.tagline}
          title={content.hero.title}
          description={content.hero.description}
        />
      </section>

      {/* Mission statement section with CMS content */}
      <section className="py-20 border-b border-neutral-900">
        <div className="w-full px-6 lg:px-8">
          <div className="text-center">
            <Typography variant="h2" fontWeight="light" className="mb-4">
              {content.missionStatement.title}
            </Typography>
            <Typography variant="p" className="max-w-3xl mx-auto">
              {content.missionStatement.description}
            </Typography>
          </div>
        </div>
      </section>

      {/* Three-column grid with CMS content */}
      <section className="relative border-b border-neutral-900">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y divide-neutral-900 md:divide-y-0 md:divide-x">
            {content.categories.map((category: any, idx: number) => (
              <a
                key={idx}
                href={`/gallery?filter=${category.galleryFilter}`}
                className="block p-8 md:p-12 lg:p-16 focus-visible:outline-current transition-all duration-300 group"
              >
                <Typography variant="small" className="mt-8 uppercase">
                  {category.label}
                </Typography>
                <Typography
                  variant="h3"
                  className="mt-8 group-hover:text-blue-600 transition-colors duration-300 ease-in-out"
                  fontWeight="light"
                >
                  {category.title}
                </Typography>
                <Typography variant="p" className="mt-4 md:mt-6">
                  {category.description}
                </Typography>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured work section with CMS content */}
      <section className="pt-20">
        <div className="w-full space-y-16">
          <div className="text-center">
            <Typography variant="small" className="mb-6 uppercase">
              Featured Work
            </Typography>
            <Typography variant="h2" fontWeight="light" className="mb-4 mt-8">
              {content.featuredWork.sectionTitle}
            </Typography>
            <Typography variant="p" className="mt-6 max-w-3xl mx-auto">
              {content.featuredWork.sectionDescription}
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-neutral-900">
            {featuredImages.slice(0, 6).map((p, idx) => (
              <div
                key={idx}
                className="group p-4 transition-all duration-700 ease-in-out"
              >
                <div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-800 aspect-[4/5]">
                  <img
                    src={p.src}
                    alt={p.alt || "Featured work"}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="flex justify-center pb-32">
        <Button href="/gallery" className="w-full text-center" variant="light">
          {content.featuredWork.buttonText}
        </Button>
      </div>
    </div>
  );
}
