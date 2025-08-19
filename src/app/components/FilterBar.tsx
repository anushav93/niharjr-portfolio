"use client";
import { cn } from "@/functions/cn";
import React, { useRef, useEffect } from "react";

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
              className={`hover:text-blue-600 relative p-4 sm:p-6 md:p-8 transition-all duration-300 text-center border-r border-neutral-400 dark:border-neutral-600 last:border-r-0 flex-shrink-0 min-w-[120px] sm:min-w-[140px] md:min-w-0 md:flex-1 ${
                active === f
                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                  : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              }`}
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
    </div>
  );
}
