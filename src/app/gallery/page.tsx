import GalleryClient from "./GalleryClient";
import Typography from "@/components/Typography";
import { UNSPLASH_ACCESS_KEY, UNSPLASH_USERNAME } from "@/functions/config";
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

async function fetchCollections(): Promise<Collection[]> {
  try {
    const username = UNSPLASH_USERNAME;
    const headers = { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } as any;
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const collectionsRes = await fetch(
      `https://api.unsplash.com/users/${username}/collections?per_page=30`,
      { 
        headers, 
        next: { revalidate: 3600 },
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!collectionsRes.ok) {
      console.error('Failed to fetch collections:', collectionsRes.status, collectionsRes.statusText);
      return [];
    }
    
    const collections = await collectionsRes.json();
    
    const collectionsWithPhotos: Collection[] = await Promise.all(
      collections.map(async (collection: any) => {
        try {
          // Create abort controller for timeout
          const photoController = new AbortController();
          const photoTimeoutId = setTimeout(() => photoController.abort(), 10000);
          
          const photosRes = await fetch(
            `https://api.unsplash.com/collections/${collection.id}/photos?per_page=30`,
            { 
              headers, 
              next: { revalidate: 3600 },
              signal: photoController.signal
            }
          );
          
          clearTimeout(photoTimeoutId);
          
          if (!photosRes.ok) {
            console.error(`Failed to fetch photos for collection ${collection.id}:`, photosRes.status, photosRes.statusText);
            return { ...collection, photos: [] };
          }
          
          const photos = await photosRes.json();
          return { ...collection, photos };
        } catch (error) {
          console.error(`Error fetching photos for collection ${collection.id}:`, error);
          return { ...collection, photos: [] };
        }
      })
    );
    
    return collectionsWithPhotos;
  } catch (error) {
    console.error('Error fetching collections:', error);
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
    <div className="min-h-screen bg-white dark:bg-neutral-900 ">
      {/* Gallery Hero */}
      <section className="pt-32 ">
        <div className="w-full px-6 lg:px-8">
          <div className="text-center">
            <Typography
              variant="small"
              className="mb-6 uppercase px-2 py-1 bg-green-500 text-white rounded-full"
            >
              Gallery
            </Typography>
            <Typography variant="h1" fontWeight="light" className="mb-4 mt-8">
              Visual Collection
            </Typography>
            <Typography variant="p" className="max-w-3xl mx-auto">
              Explore my complete portfolio of photography work, organized by
              style and subject matter.
            </Typography>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-neutral-100 mx-auto mb-4"></div>
                <p className="text-neutral-600 dark:text-neutral-300">
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
      </section>
    </div>
  );
}
