import React from "react";

type Photo = {
  id?: string;
  title?: string | null;
  alt_description?: string | null;
  description?: string | null;
  urls: { small?: string; regular?: string; full?: string };
  user?: { name?: string };
};

// Helper function to generate srcset for responsive images
const generateSrcSet = (photo: Photo) => {
  if (!photo.urls.regular) return '';
  
  // Extract the base URL without size parameters
  const baseUrl = photo.urls.regular.split('?')[0];
  
  // Generate different sizes for srcset
  const sizes = [
    { width: 300, descriptor: '300w' },
    { width: 600, descriptor: '600w' },
    { width: 800, descriptor: '800w' },
    { width: 1200, descriptor: '1200w' },
    { width: 1600, descriptor: '1600w' }
  ];
  
  return sizes
    .map(({ width, descriptor }) => `${baseUrl}?w=${width}&q=80 ${descriptor}`)
    .join(', ');
};

type ImageGridProps = {
  photos: Photo[];
  onSelect?: (index: number) => void;
};

const ImageGrid = React.memo(function ImageGrid({ photos, onSelect }: ImageGridProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <p className="text-xs tracking-wider uppercase text-text-muted mb-2">No photos found</p>
        <p className="text-sm text-text-secondary">Try selecting a different category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-8 max-w-[1600px] mx-auto">
      {photos.map((photo, index) => (
        <div
          key={`${photo.id}-${index}`}
          className="group cursor-pointer relative"
          onClick={() => onSelect?.(index)}
        >
          <div className="relative overflow-hidden bg-neutral-100 aspect-[3/4]">
            <img
              src={photo.urls.regular || photo.urls.small || photo.urls.full || ""}
              srcSet={generateSrcSet(photo)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              alt={photo.title || "Photography"}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
              loading="lazy"
            />
            
            {/* Hover overlay with description */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm font-light tracking-wide line-clamp-2">
                  {photo.title || ""}
                </p>
                {photo.user?.name && (
                  <p className="text-white/70 text-xs mt-1 font-light">
                    {photo.user.name}
                  </p>
                )}
              </div>
              
              {/* Click indicator */}
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg 
                    className="w-4 h-4 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default ImageGrid;
