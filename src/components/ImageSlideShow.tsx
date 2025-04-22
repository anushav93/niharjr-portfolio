import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface ImageSlideshowProps {
  images: string[];
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ images }) => {
  const [randomImage, setRandomImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (images.length === 0) return;

    // Get the last shown image index from cookie
    const lastShownIndexCookie = Cookies.get("lastShownImageIndex");
    let lastShownIndex = lastShownIndexCookie ? parseInt(lastShownIndexCookie, 10) : -1;
    
    // Get available indices excluding the last shown one
    const availableIndices = Array.from(
      { length: images.length },
      (_, i) => i
    ).filter(idx => idx !== lastShownIndex);
    
    // If we've somehow filtered all indices (shouldn't happen unless there's only 1 image)
    if (availableIndices.length === 0 && images.length > 0) {
      availableIndices.push(0);
    }
    
    // Select a random image from the available indices
    const randomIndexPosition = Math.floor(Math.random() * availableIndices.length);
    const randomIndex = availableIndices[randomIndexPosition];
    const selectedImage = images[randomIndex];
    
    // Save the current index to cookie (expires in 1 day)
    Cookies.set("lastShownImageIndex", randomIndex.toString(), { expires: 1 });
    
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
      <div className="w-full h-full">
        <div className="relative w-full h-[60vh] lg:h-[80vh] overflow-hidden">
          <div className="absolute overflow-hidden h-full w-full">
            <img 
              src={randomImage} 
              alt="Framed photograph" 
              className="w-full h-full object-cover bg-center"
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
