"use client";
import { cn } from "@/functions/cn";
import React, { useRef, useEffect, useState } from "react";

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
    }
  }, [active]);

  const handleFilterClick = (filter: string) => {
    onChange(filter);
  };

  return (
    <div className="px-4 md:px-8 py-8">
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth max-w-[1600px] mx-auto"
      >
        {filters.map((f) => (
          <button
            key={f}
            ref={(el) => {
              buttonRefs.current[f] = el;
            }}
            onClick={() => handleFilterClick(f)}
            className={cn(
              "px-6 py-2 text-xs tracking-[0.2em] uppercase font-light transition-all duration-200 whitespace-nowrap",
              active === f
                ? "text-primary-700 border-b-2 border-primary-600"
                : "text-text-secondary hover:text-primary-600 border-b-2 border-transparent"
            )}
          >
            {f === "ALL" ? "All Work" : f}
          </button>
        ))}
      </div>
    </div>
  );
}
