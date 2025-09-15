"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterBar from "../components/FilterBar";
import ImageGrid from "../components/ImageGrid";
import Lightbox from "../components/Lightbox";

type Photo = {
  id: string;
  alt_description?: string | null;
  description?: string | null;
  urls: { small?: string; regular?: string; full?: string };
  user?: { name?: string };
};

export default function GalleryClient({
  filters,
  initialActive,
  initialPhotos,
}: {
  filters: string[];
  initialActive: string;
  initialPhotos: Photo[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState<string>(initialActive);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [shuffledPhotos, setShuffledPhotos] = useState<Photo[]>(initialPhotos);

  // Function to shuffle an array - memoized without dependencies
  const shuffleArray = useCallback((array: Photo[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Manual shuffle function
  const shufflePhotos = useCallback(() => {
    if (active === "ALL") {
      setShuffledPhotos(prev => shuffleArray(prev));
    }
  }, [active, shuffleArray]);

  // Initialize shuffled photos and handle filter changes
  useEffect(() => {
    if (active === "ALL") {
      setShuffledPhotos(shuffleArray(initialPhotos));
    } else {
      setShuffledPhotos(initialPhotos);
    }
  }, [active, initialPhotos, shuffleArray]);

  const updateFilter = (next: string) => {
    setActive(next);
    const params = new URLSearchParams(searchParams?.toString());
    if (next === "ALL") params.delete("filter");
    else params.set("filter", next);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div>
      <div className="border-t border-neutral-900 mt-20">
        <FilterBar filters={filters} active={active} onChange={updateFilter} />
      </div>
      <div className="py-12">
        <ImageGrid
          photos={shuffledPhotos}
          onSelect={(i) => setLightboxIndex(i)}
        />
      </div>
      <Lightbox
        isOpen={lightboxIndex !== null}
        photos={shuffledPhotos}
        index={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
