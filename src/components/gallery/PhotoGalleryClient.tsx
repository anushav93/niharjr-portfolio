'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Photo } from '@/types/contentful';
import FilterBar, { type GalleryFilter } from '@/components/gallery/FilterBar';
import ImageGrid from '@/components/gallery/ImageGrid';
import Lightbox from '@/components/gallery/Lightbox';

type PhotoGalleryClientProps = {
  photos: Photo[];
  filters?: GalleryFilter[];
  initialActive?: string;
};

function GalleryLightbox({
  photos,
}: {
  photos: Photo[];
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <section className="py-8" aria-label="Photo gallery">
        <ImageGrid photos={photos} onSelect={(i) => setLightboxIndex(i)} />
      </section>
      <Lightbox
        isOpen={lightboxIndex !== null}
        photos={photos}
        index={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={(idx) => setLightboxIndex(idx)}
      />
    </>
  );
}

function FilteredGallery({
  photos,
  filters,
  initialActive,
}: {
  photos: Photo[];
  filters: GalleryFilter[];
  initialActive: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(initialActive);
  const [displayPhotos, setDisplayPhotos] = useState(photos);

  const shuffleArray = useCallback((array: Photo[]) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, []);

  useEffect(() => {
    setDisplayPhotos(active === 'ALL' ? shuffleArray(photos) : photos);
  }, [active, photos, shuffleArray]);

  const updateFilter = (next: string) => {
    setActive(next);
    const params = new URLSearchParams(searchParams?.toString());
    if (next === 'ALL') params.delete('filter');
    else params.set('filter', next);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div>
      <div className="border-t border-t-stone-300">
        <FilterBar filters={filters} active={active} onChange={updateFilter} />
      </div>
      <GalleryLightbox photos={displayPhotos} />
    </div>
  );
}

export default function PhotoGalleryClient({
  photos,
  filters,
  initialActive = 'ALL',
}: PhotoGalleryClientProps) {
  const hasFilters = filters && filters.length > 1;

  if (hasFilters) {
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
          </div>
        }
      >
        <FilteredGallery photos={photos} filters={filters} initialActive={initialActive} />
      </Suspense>
    );
  }

  return <GalleryLightbox photos={photos} />;
}
