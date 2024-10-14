// components/ImageSlideshow.tsx
import React, { useEffect, useState } from 'react';

interface ImageSlideshowProps {
  images: string[];
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);


  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }
    }, 500); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  useEffect(() => {
    const pauseTimer = setTimeout(() => {
      setIsPaused(false);
    }, 40000); // Pause for 40 seconds
    

    return () => clearTimeout(pauseTimer);
  }, [currentImageIndex]);

  return (
    <div className="relative w-full h-full" >
   

      <div className='bg-cover bg-center h-[80vh] w-full'
      onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      style={{backgroundImage:`url(${images[currentImageIndex]})`}}
      >

      </div>
    </div>
  );
};

export default ImageSlideshow;