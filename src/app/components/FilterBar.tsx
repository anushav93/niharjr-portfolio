"use client";
import { cn } from "@/functions/cn";
import React, { useRef, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type FilterBarProps = {
  filters: string[];
  active: string;
  onChange: (value: string) => void;
};

export default function FilterBar({
  filters,
  active,
  onChange,
}: FilterBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Smooth scroll to active item when it changes
  useEffect(() => {
    const activeButton = buttonRefs.current[active];
    const container = containerRef.current;

    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      // Calculate scroll position to center the active button
      const scrollLeft =
        activeButton.offsetLeft -
        containerRect.width / 2 +
        buttonRect.width / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
      // Check scroll state after auto-scroll animation completes
      setTimeout(checkScrollState, 300);
    }
  }, [active]);

  // Check scroll state
  const checkScrollState = () => {
    const container = containerRef.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      
      // Debug logging (remove this if not needed)
      const shouldScrollLeft = scrollLeft > 1;
      const shouldScrollRight = scrollLeft < maxScrollLeft - 1;
      
      console.log('Scroll Debug:', {
        scrollLeft: scrollLeft,
        maxScrollLeft: maxScrollLeft,
        scrollWidth: container.scrollWidth,
        clientWidth: container.clientWidth,
        canScrollLeft: shouldScrollLeft,
        canScrollRight: shouldScrollRight
      });
      
      setCanScrollLeft(shouldScrollLeft);
      setCanScrollRight(shouldScrollRight);
    }
  };

  // Update scroll state on mount and resize
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is fully rendered
    const updateScrollState = () => {
      requestAnimationFrame(() => {
        checkScrollState();
      });
    };

    updateScrollState();
    const container = containerRef.current;
    
    if (container) {
      container.addEventListener("scroll", checkScrollState);
      window.addEventListener("resize", updateScrollState);
      
      return () => {
        container.removeEventListener("scroll", checkScrollState);
        window.removeEventListener("resize", updateScrollState);
      };
    }
  }, [filters]);

  // Also check scroll state after the component fully mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollState();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const scrollLeft = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({
        left: -200,
        behavior: "smooth",
      });
      // Check scroll state after animation completes
      setTimeout(checkScrollState, 300);
    }
  };

  const scrollRight = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({
        left: 200,
        behavior: "smooth",
      });
      // Check scroll state after animation completes
      setTimeout(checkScrollState, 300);
    }
  };

  const handleFilterClick = (filter: string) => {
    onChange(filter);
  };

  return (
    <div>
     
      
      <div className="border-b border-neutral-900">
        <div
          ref={containerRef}
          className="flex overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {filters.map((f, idx) => (
            <button
              key={f}
              ref={(el) => {
                buttonRefs.current[f] = el;
              }}
              onClick={() => handleFilterClick(f)}
              className={cn(
                "hover:text-blue-600 relative p-4 sm:p-6 md:p-8 transition-all duration-300 text-center",
                "border-r border-neutral-400 dark:border-neutral-600 last:border-r-0",
                "flex-grow flex-shrink-0 min-w-fit",
                active === f
                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                  : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              )}
            >
              <div
                className={cn(
                  "text-[11px] tracking-[0.15em] uppercase font-medium whitespace-nowrap dark:text-neutral-400",
                  active === f && "text-white dark:text-neutral-900"
                )}
              >
                {f === "ALL" ? "ALL WORK" : f}
              </div>
            </button>
          ))}
        </div>
      </div>
       {/* Scroll Arrows - Above Filter Bar */}
       <div className="flex justify-end mt-2 mr-2 gap-1">
        <button
          onClick={scrollLeft}
          className={cn(
            "w-8 h-8 rounded-full backdrop-blur-sm bg-neutral-300/80 dark:bg-neutral-800/80",
            "border border-neutral-200 dark:border-neutral-700",
            "transition-all duration-200 hover:scale-110 hover:bg-white dark:hover:bg-neutral-800",
            "flex items-center justify-center",
            canScrollLeft
              ? "opacity-100 hover:text-blue-600"
              : "opacity-30 cursor-not-allowed"
          )}
          disabled={!canScrollLeft}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <button
          onClick={scrollRight}
          className={cn(
            "w-8 h-8 rounded-full backdrop-blur-sm bg-neutral-300/80 dark:bg-neutral-800/80",
            "border border-neutral-200 dark:border-neutral-700",
            "transition-all duration-200 hover:scale-110 hover:bg-white dark:hover:bg-neutral-800",
            "flex items-center justify-center",
            canScrollRight
              ? "opacity-100 hover:text-blue-600"
              : "opacity-30 cursor-not-allowed"
          )}
          disabled={!canScrollRight}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
