import React, { useEffect, useState } from "react";

interface ImageSlideshowProps {
  images: string[];
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  useEffect(() => {
    // Preload images
    const preloadImages = async () => {
      const loadPromises = images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(src);
          img.onerror = reject;
        });
      });

      try {
        const loaded = await Promise.all(loadPromises);
        setLoadedImages(loaded);
      } catch (error) {
        console.error("Error preloading images:", error);
      }
    };

    preloadImages();
  }, [images]);

  useEffect(() => {
    if (loadedImages.length === 0) return; // Don't start the slideshow until images are loaded

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % loadedImages.length
        );
      }
    }, 1000); // Change image every 0.5 seconds

    return () => clearInterval(interval);
  }, [isPaused, loadedImages.length]);

  useEffect(() => {
    const pauseTimer = setTimeout(() => {
      setIsPaused(false);
    }, 40000); // Pause for 40 seconds

    return () => clearTimeout(pauseTimer);
  }, [currentImageIndex]);

  if (loadedImages.length === 0) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  return (
    <div className="relative w-full h-full">
      <div
        className="bg-cover bg-center h-[60vh] lg:h-[80vh] w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ backgroundImage: `url(${loadedImages[currentImageIndex]})` }}
      ></div>
    </div>
  );
};

export default ImageSlideshow;
