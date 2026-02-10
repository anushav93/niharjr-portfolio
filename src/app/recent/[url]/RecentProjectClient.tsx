"use client";

import React, { useState } from "react";
import ImageGrid from "../../components/ImageGrid";
import Lightbox from "../../components/Lightbox";

type Photo = {
  id: string;
  title?: string | null;
  alt_description?: string | null;
  urls: { small?: string; regular?: string; full?: string };
};

type RecentProjectClientProps = {
  photos: Photo[];
};

export default function RecentProjectClient({ photos }: RecentProjectClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div>
      <div className="py-8">
        <ImageGrid
          photos={photos}
          onSelect={(i) => setLightboxIndex(i)}
        />
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
