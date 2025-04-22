import React, { useState, useEffect } from "react";

interface ImageSlideshowProps {
  images: string[];
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ images }) => {
  const [randomImage, setRandomImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Select a random image from the array
    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomIndex];
    
    // Preload the selected image
    const img = new Image();
    img.src = selectedImage;
    img.onload = () => {
      setRandomImage(selectedImage);
      setIsLoading(false);
    };
    img.onerror = () => {
      console.error("Error loading image:", selectedImage);
      setIsLoading(false);
    };
  }, [images]);

  if (isLoading || !randomImage) {
    return <div className="h-[60vh] lg:h-[80vh] w-full bg-gray-100 animate-pulse"></div>;
  }

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full p-4">
        {/* Outer frame container with realistic shadow */}
        <div className="relative w-full h-[60vh] lg:h-[80vh] shadow-[5px_5px_15px_rgba(0,0,0,0.35)] transform translate-y-1 translate-x-1">
          {/* Black frame with better inner shadow effect */}
          <div className="absolute inset-0 border-[16px] border-black" style={{
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 8px rgba(0,0,0,0.5), 2px 2px 10px rgba(0,0,0,0.15)'
          }}></div>
          
          {/* White mat with subtle shadow */}
          <div className="absolute inset-[16px] border-[16px] border-white" style={{
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.15)'
          }}></div>
          
          {/* Image inside mat with object-fit cover for better display */}
          <div className="absolute inset-[32px] overflow-hidden">
            <img 
              src={randomImage} 
              alt="Framed photograph" 
              className="w-full h-full object-cover"
              style={{
                boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSlideshow;
