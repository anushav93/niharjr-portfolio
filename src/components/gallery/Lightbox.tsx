"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Photo } from "@/types/contentful";
import { photoSrc } from '@/lib/images';

type LightboxProps = {
  isOpen: boolean;
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndexChange: (nextIndex: number) => void;
};

function lightboxSrcSet(photo: Photo): string {
  return [800, 1200, 1600, 2000, 2400]
    .map((w) => `${photoSrc(photo, w, 85)} ${w}w`)
    .join(', ');
}

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
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onIndexChange(index + 1);
      if (e.key === 'ArrowLeft' && hasPrevious) onIndexChange(index - 1);
    },
    [hasNext, hasPrevious, index, isOpen, onClose, onIndexChange]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
        className="absolute top-4 right-4 rounded px-3 py-1 bg-white/10 hover:bg-white/20"
        onClick={onClose}
      >
        Close
      </button>
      {hasPrevious && (
        <button
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 rounded px-3 py-2 bg-white/10 hover:bg-white/20"
          onClick={() => onIndexChange(index - 1)}
        >
          ←
        </button>
      )}
      {hasNext && (
        <button
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 rounded px-3 py-2 bg-white/10 hover:bg-white/20"
          onClick={() => onIndexChange(index + 1)}
        >
          →
        </button>
      )}
      <img
        src={photoSrc(photo, 2000, 85)}
        srcSet={lightboxSrcSet(photo)}
        sizes="(max-width: 768px) 100vw, 80vw"
        alt={photo.alt}
        className="max-h-[80vh] w-auto object-contain"
      />
    </div>
  );
}
