import Layout from "@/components/Layout";
import PhotoGrid from "@/components/PhotosGrid";
import { cn } from "@/functions/cn";
import { UNSPLASH_ACCESS_KEY, UNSPLASH_USERNAME } from "@/functions/config";
import { useEffect, useState } from "react";

interface Collection {
  id: string;
  title: string;
  photos: any[];
}

type PhotographyProps = {
  collections: Collection[];
};

const GalleryPage = ({ collections }: PhotographyProps) => {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [filters, setFilters] = useState<string[]>(["ALL"]);
  const [filteredPhotos, setFilteredPhotos] = useState<any[]>([]);

  useEffect(() => {
    if (collections.length > 0) {
      const uniqueFilters = [
        "ALL",
        ...Array.from(new Set(collections.map((c) => c.title))),
      ];
      setFilters(uniqueFilters);
      updateFilteredPhotos("ALL");
    }
  }, [collections]);

  const updateFilteredPhotos = (filter: string) => {
    if (filter === "ALL") {
      setFilteredPhotos(collections.flatMap((c) => c.photos));
    } else {
      const selectedCollection = collections.find((c) => c.title === filter);
      setFilteredPhotos(selectedCollection ? selectedCollection.photos : []);
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    updateFilteredPhotos(filter);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] bg-white px-4 md:px-8 mt-12 mb-24">
        <div className="flex flex-row flex-wrap items-end gap-x-2 mb-12">
          <h1 className="font-medium text-6xl text-neutral-900">CAPTURING </h1>{" "}
          <h1 className="text-4xl italic font-extralight text-neutral-900">
            {" "}
            Moments of Serenity
          </h1>
        </div>
        <div className="flex flex-row flex-wrap gap-y-3 gap-x-4 mt-4 mb-12">
          {filters.map((category) => {
            return (
              <div
                key={category}
                onClick={() => handleFilterClick(category)}
                className={cn(
                  "text-lg uppercase border-2 border-neutral-900 text-neutral-900 px-2 py-1 cursor-pointer transition-all duration-300 ease-in-out",
                  activeFilter === category
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-neutral-900"
                )}
              >
                {category}
              </div>
            );
          })}
        </div>

        <PhotoGrid photos={filteredPhotos} />
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  try {
    const username = UNSPLASH_USERNAME;

    // Fetch user collections
    const collectionsRes = await fetch(
      `https://api.unsplash.com/users/${username}/collections?per_page=30`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!collectionsRes.ok) {
      throw new Error("Failed to fetch collections");
    }

    const collections = await collectionsRes.json();

    // Fetch photos for each collection
    const collectionsWithPhotos = await Promise.all(
      collections.map(async (collection: any) => {
        const photosRes = await fetch(
          `https://api.unsplash.com/collections/${collection.id}/photos?per_page=30`,
          {
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
          }
        );

        if (!photosRes.ok) {
          return { ...collection, photos: [] };
        }

        const photos = await photosRes.json();
        return { ...collection, photos };
      })
    );

    return {
      props: {
        collections: collectionsWithPhotos,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        collections: [],
      },
      revalidate: 60, // Try again sooner if there was an error
    };
  }
}

export default GalleryPage;
