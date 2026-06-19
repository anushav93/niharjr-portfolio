"use client";

import Image from "next/image";
import type { Photo } from "@/types/contentful";
import { photoSrc } from '@/lib/images';

type ImageGridProps = {
  photos: Photo[];
  onSelect?: (index: number) => void;
};

export default function ImageGrid({ photos, onSelect }: ImageGridProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <p className="text-xs tracking-wider uppercase text-text-muted mb-2">No photos found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-8 max-w-[1600px] mx-auto">
      {photos.map((photo, index) => (
        <button
          key={`${photo.id}-${index}`}
          type="button"
          aria-label={photo.title || photo.alt || `View photo ${index + 1}`}
          className="group cursor-pointer relative text-left"
          onClick={() => onSelect?.(index)}
        >
          <div className="relative overflow-hidden bg-neutral-100 aspect-[3/4]">
            <Image
              src={photoSrc(photo, 1080)}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              quality={85}
              className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm font-light tracking-wide line-clamp-2">
                  {photo.title}
                </p>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
