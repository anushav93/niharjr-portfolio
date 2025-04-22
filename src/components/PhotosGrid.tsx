import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Masonry from "react-masonry-css";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface Photo {
  id: string;
  urls: {
    small: string;
    regular: string;
    full?: string;
    raw?: string;
  };
  alt_description?: string;
  height: number;
  width: number;
  user?: {
    name: string;
    username: string;
  };
}

const Modal: React.FC<{
  photo: Photo;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}> = ({ photo, onClose, onNext, onPrevious, hasNext, hasPrevious }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [swipeProgress, setSwipeProgress] = useState(0);
  const minSwipeDistance = 50; // Minimum distance for a swipe to register
  const maxSwipeDistance = 200; // Distance for a full swipe

  // Simulated progress before actual image load completes
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        // Max out at 80% until the image actually loads
        if (prev >= 80) {
          clearInterval(interval);
          return 80;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    // Reset loading state when photo changes
    setIsLoading(true);
    setLoadingProgress(0);
  }, [photo.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "ArrowLeft" && hasPrevious) onPrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrevious, hasNext, hasPrevious]);

  const handleImageLoad = () => {
    setLoadingProgress(100);
    // Short delay to show the completed progress bar before hiding it
    setTimeout(() => setIsLoading(false), 300);
  };

  // Touch event handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setSwipeDirection(null);
    setSwipeProgress(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;

    const currentX = e.touches[0].clientX;
    touchEndX.current = currentX;

    const diff = touchStartX.current - currentX;

    // Determine swipe direction
    if (diff > 0 && hasNext) {
      setSwipeDirection("left");
      setSwipeProgress(Math.min(Math.abs(diff) / maxSwipeDistance, 1));
    } else if (diff < 0 && hasPrevious) {
      setSwipeDirection("right");
      setSwipeProgress(Math.min(Math.abs(diff) / maxSwipeDistance, 1));
    } else {
      setSwipeDirection(null);
      setSwipeProgress(0);
    }
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && hasNext) {
      onNext();
    } else if (isRightSwipe && hasPrevious) {
      onPrevious();
    }

    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
    setSwipeDirection(null);
    setSwipeProgress(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg overflow-hidden max-w-4xl max-h-[90vh] w-full flex flex-col shadow-xl relative"
      >
        <div className="absolute top-0 left-0 right-0 z-10">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="w-full h-1 bg-gray-800/20 overflow-hidden"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all z-20"
        >
          <XMarkIcon className="w-6 h-6 text-white" />
        </button>

        <div
          className="relative w-full"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <div className="text-white text-sm">{loadingProgress}%</div>
            </div>
          )}

          {/* Swipe direction indicators */}
          {swipeDirection === "left" && (
            <div
              className="absolute inset-y-0 right-0 bg-gradient-to-l from-black/40 to-transparent pointer-events-none touch-device:block hidden"
              style={{
                width: `${swipeProgress * 20}%`,
                opacity: swipeProgress,
              }}
            >
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 transition-all duration-200"
                style={{ opacity: swipeProgress }}
              >
                <ArrowRightIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          )}

          {swipeDirection === "right" && (
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none touch-device:block hidden"
              style={{
                width: `${swipeProgress * 20}%`,
                opacity: swipeProgress,
              }}
            >
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 transition-all duration-200"
                style={{ opacity: swipeProgress }}
              >
                <ArrowLeftIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          )}

          <img
            src={photo.urls.full || photo.urls.regular}
            alt={photo.alt_description || "Unsplash photo"}
            className="w-full h-auto max-h-[70vh] object-contain"
            onLoad={handleImageLoad}
            draggable={false}
            style={{
              transform: swipeDirection
                ? `translateX(${
                    swipeDirection === "right"
                      ? swipeProgress * 30
                      : -swipeProgress * 30
                  }px)`
                : "none",
              transition: !swipeDirection ? "transform 0.3s ease" : "none",
            }}
          />

          {/* Initial swipe hint for mobile - only shown once */}
          <div className="hidden touch-device:flex absolute inset-0 pointer-events-none items-center justify-center">
            <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              Swipe to navigate
            </div>
          </div>

          {/* Regular navigation buttons - hide on touch devices */}
          {hasPrevious && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all touch-device:hidden"
            >
              <ArrowLeftIcon className="w-6 h-6 text-white" />
            </button>
          )}

          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all touch-device:hidden"
            >
              <ArrowRightIcon className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const PhotoGrid: React.FC<{ photos: Photo[] }> = ({ photos }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );

  const selectedPhoto =
    selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  const handleNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const closeModal = () => {
    setSelectedPhotoIndex(null);
  };

  // Define breakpoints for the masonry grid
  const breakpointColumnsObj = {
    default: 4, // Default to 4 columns
    1280: 4,    // 4 columns for large screens
    1024: 3,    // 3 columns for medium screens
    768: 2,     // 2 columns for small screens
    640: 1      // 1 column for mobile
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-full -ml-4" // Negative margin to offset the gutter
        columnClassName="pl-4" // Left padding creates the gutter
      >
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-4 break-inside-avoid"
            onClick={() => setSelectedPhotoIndex(index)}
          >
            <img
              src={photo.urls.regular}
              alt={photo.alt_description || "Unsplash photo"}
              className="w-full shadow-md cursor-pointer hover:opacity-90 transition-opacity"
            />
          </motion.div>
        ))}
      </Masonry>
      <AnimatePresence>
        {selectedPhoto && (
          <Modal
            photo={selectedPhoto}
            onClose={closeModal}
            onNext={handleNext}
            onPrevious={handlePrevious}
            hasNext={
              selectedPhotoIndex !== null &&
              selectedPhotoIndex < photos.length - 1
            }
            hasPrevious={selectedPhotoIndex !== null && selectedPhotoIndex > 0}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PhotoGrid;
