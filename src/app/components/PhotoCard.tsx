import React from "react";

type UnsplashLikePhoto = {
  id?: string;
  alt_description?: string | null;
  description?: string | null;
  urls: { small?: string; regular?: string; full?: string };
  user?: { name?: string };
};

type PhotoCardProps = {
  photo: UnsplashLikePhoto;
  onClick?: () => void;
};

export default function PhotoCard({ photo, onClick }: PhotoCardProps) {
  const alt = photo.alt_description || photo.description || "Photo";
  const credit = photo.user?.name;

  return (
    <figure className="group cursor-pointer" onClick={onClick}>
      <div className="relative overflow-hidden rounded-md">
        <img
          src={photo.urls.regular || photo.urls.small || photo.urls.full || ""}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      {(alt || credit) && (
        <figcaption className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          <span className="line-clamp-2">{alt}</span>
          {credit ? (
            <span className="ml-2 text-neutral-500 dark:text-neutral-400">
              — {credit}
            </span>
          ) : null}
        </figcaption>
      )}
    </figure>
  );
}
