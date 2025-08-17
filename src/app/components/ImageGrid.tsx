import React from "react";

type Photo = {
  id?: string;
  alt_description?: string | null;
  description?: string | null;
  urls: { small?: string; regular?: string; full?: string };
  user?: { name?: string };
};

type ImageGridProps = {
  photos: Photo[];
  onSelect?: (index: number) => void;
};

export default function ImageGrid({ photos, onSelect }: ImageGridProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-20 ">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          No photos found
        </h3>
        <p className="text-neutral-600 dark:text-neutral-300">
          Try selecting a different category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2  ">
      {photos.map((photo, index) => (
        <div
          key={photo.id ?? index}
          className="group cursor-pointer"
          onClick={() => onSelect?.(index)}
        >
          <div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-800 aspect-[4/5]">
            <img
              src={
                photo.urls.regular || photo.urls.small || photo.urls.full || ""
              }
              alt={photo.alt_description || photo.description || "Photo"}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm font-medium line-clamp-2">
                {photo.alt_description || photo.description || "Untitled"}
              </p>
              {photo.user?.name && (
                <p className="text-xs text-white/70 mt-1">
                  by {photo.user.name}
                </p>
              )}
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/20 backdrop-blur-sm p-2">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
