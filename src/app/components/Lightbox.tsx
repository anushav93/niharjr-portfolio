"use client";
import React, { useCallback, useEffect, useRef } from "react";

type Photo = {
  urls: { regular?: string; full?: string };
  alt_description?: string | null;
};

// Helper function to generate srcset for Unsplash images in lightbox
const generateLightboxSrcSet = (photo: Photo) => {
  if (!photo.urls.full) return '';
  
  // Extract the base URL without size parameters
  const baseUrl = photo.urls.full.split('?')[0];
  
  // Generate different sizes for lightbox (larger sizes since it's full-screen)
  const sizes = [
    { width: 800, descriptor: '800w' },
    { width: 1200, descriptor: '1200w' },
    { width: 1600, descriptor: '1600w' },
    { width: 2000, descriptor: '2000w' },
    { width: 2400, descriptor: '2400w' }
  ];
  
  return sizes
    .map(({ width, descriptor }) => `${baseUrl}?w=${width}&q=85 ${descriptor}`)
    .join(', ');
};

type LightboxProps = {
  isOpen: boolean;
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndexChange: (nextIndex: number) => void;
};

export default function Lightbox({
  isOpen,
  photos,
  index,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const hasPrevious = index > 0;
  const hasNext = index < photos.length - 1;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext) onIndexChange(index + 1);
      if (e.key === "ArrowLeft" && hasPrevious) onIndexChange(index - 1);
    },
    [hasNext, hasPrevious, index, isOpen, onClose, onIndexChange]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // focus trap
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const previouslyFocused = document.activeElement as HTMLElement | null;
      dialogRef.current.focus();
      return () => previouslyFocused?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const photo = photos[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 text-white"
    >
      <button
        className="absolute top-4 right-4 rounded px-3 py-1 bg-white/10 hover:bg-white/20 focus-visible:outline-white"
        onClick={onClose}
      >
        Close
      </button>

      {hasPrevious && (
        <button
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 rounded px-3 py-2 bg-white/10 hover:bg-white/20 focus-visible:outline-white"
          onClick={() => onIndexChange(index - 1)}
        >
          ←
        </button>
      )}
      {hasNext && (
        <button
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 rounded px-3 py-2 bg-white/10 hover:bg-white/20 focus-visible:outline-white"
          onClick={() => onIndexChange(index + 1)}
        >
          →
        </button>
      )}

      <img
        src={photo.urls.full || photo.urls.regular || ""}
        srcSet={generateLightboxSrcSet(photo)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
        alt={photo.alt_description || ""}
        className="max-h-[80vh] w-auto object-contain"
      />
    </div>
  );
}
