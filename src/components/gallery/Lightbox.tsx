"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { Photo } from "@/types/contentful";
import { photoSrc } from '@/lib/images';

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
  const altText = photo.alt || photo.title || 'Photograph';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title || photo.alt || 'Photo viewer'}
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 text-white"
    >
      <button
        className="absolute top-4 right-4 rounded px-3 py-1 bg-white/10 hover:bg-white/20"
        onClick={onClose}
        aria-label="Close"
      >
        Close
      </button>
      {hasPrevious && (
        <button
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 rounded px-3 py-2 bg-white/10 hover:bg-white/20"
          onClick={() => onIndexChange(index - 1)}
          aria-label="Previous photo"
        >
          ←
        </button>
      )}
      {hasNext && (
        <button
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 rounded px-3 py-2 bg-white/10 hover:bg-white/20"
          onClick={() => onIndexChange(index + 1)}
          aria-label="Next photo"
        >
          →
        </button>
      )}
      <div className="relative w-full max-w-[80vw] h-[80vh]">
        <Image
          src={photoSrc(photo, 2000, 85)}
          alt={altText}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 80vw"
          quality={85}
          className="object-contain"
        />
      </div>
    </div>
  );
}
