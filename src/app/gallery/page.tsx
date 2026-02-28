import GalleryClient from "./GalleryClient";
import { getGalleryCollections } from "@/lib/contentful";
import { Suspense } from "react";

// Cache for 1 hour (3600 seconds)
export const revalidate = 3600;

type Photo = {
  id: string;
  alt_description?: string | null;
  description?: string | null;
  urls: { small?: string; regular?: string; full?: string };
  user?: { name?: string };
};

type Collection = { id: string; title: string; photos: Photo[] };

/**
 * Fetch gallery collections from Contentful
 */
async function fetchCollections(): Promise<Collection[]> {
  try {
    const contentfulCollections = await getGalleryCollections();
    
    // Transform Contentful format to match expected format
    return contentfulCollections.map((collection) => ({
      id: collection.id,
      title: collection.name,
      photos: collection.photos.map((photo) => ({
        id: photo.id,
        title: photo.title,
        alt_description: photo.alt,
        description: photo.title,
        urls: {
          small: `${photo.url}?w=400&fm=webp&q=80`,
          regular: `${photo.url}?w=1080&fm=webp&q=85`,
          full: photo.url,
        },
        user: { name: 'Portfolio' },
      })),
    }));
  } catch (error) {
    console.error('Error fetching from Contentful:', error);
    return [];
  }
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const collections = await fetchCollections();
  const resolvedSearchParams = await searchParams;
  const filters = [
    "ALL",
    ...Array.from(new Set(collections.map((c) => c.title))),
  ] as string[];
  const active =
    resolvedSearchParams?.filter && filters.includes(resolvedSearchParams.filter)
      ? resolvedSearchParams.filter
      : "ALL";
  const photos =
    active === "ALL"
      ? collections.flatMap((c) => c.photos)
      : collections.find((c) => c.title === active)?.photos ?? [];

  return (
    <div className="min-h-screen bg-[#f5e9df]">
      {/* Gallery Header with accent */}
      <div className="relative">
        <div className="absolute top-20 left-0 w-24 h-1 bg-primary-500" />
        
        <div className="pt-32 pb-12 px-6 text-center max-w-4xl mx-auto">
          <div className="inline-block mb-4">
            <p className="text-xs tracking-[0.3em] uppercase text-primary-600 mb-2 font-medium">
              Gallery
            </p>
            <div className="h-px w-full bg-primary-400" />
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-text-primary mb-4">
            Portfolio
          </h1>
        </div>
      </div>

      {/* Gallery Content */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-xs tracking-wider uppercase text-text-secondary">
                Loading gallery...
              </p>
            </div>
          </div>
        }
      >
        <GalleryClient
          filters={filters}
          initialActive={active}
          initialPhotos={photos}
        />
      </Suspense>
    </div>
  );
}
