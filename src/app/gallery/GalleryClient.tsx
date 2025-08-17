"use client";
import React, { useMemo, useState } from "react";
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

  const photos = useMemo(() => initialPhotos, [initialPhotos]);

  const updateFilter = (next: string) => {
    setActive(next);
    const params = new URLSearchParams(searchParams?.toString());
    if (next === "ALL") params.delete("filter");
    else params.set("filter", next);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div>
      <div className="border-b border-neutral-400 dark:border-neutral-600">
        <FilterBar filters={filters} active={active} onChange={updateFilter} />
      </div>
      <div className="py-12">
        <ImageGrid photos={photos} onSelect={(i) => setLightboxIndex(i)} />
      </div>
      <Lightbox
        isOpen={lightboxIndex !== null}
        photos={photos}
        index={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
