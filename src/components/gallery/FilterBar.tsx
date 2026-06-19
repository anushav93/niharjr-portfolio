"use client";

import { cn } from "@/functions/cn";
import { useRef, useEffect, useState, useCallback } from "react";

export type GalleryFilter = {
  id: string;
  label: string;
  value: string;
};

type FilterBarProps = {
  filters: GalleryFilter[];
  active: string;
  onChange: (value: string) => void;
};

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      )}
    </svg>
  );
}

export default function FilterBar({ filters, active, onChange }: FilterBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const updateFades = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const overflow = scrollWidth > clientWidth + 4;
    setCanScroll(overflow);
    setShowLeftFade(overflow && scrollLeft > 4);
    setShowRightFade(overflow && scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  const scrollFilters = useCallback((direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    const amount = Math.max(container.clientWidth * 0.6, 160);
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  const endDrag = useCallback(() => {
    dragRef.current.active = false;
    setIsDragging(false);
    window.setTimeout(() => {
      dragRef.current.moved = false;
    }, 0);
  }, []);

  const onContainerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !canScroll) return;
    const container = containerRef.current;
    if (!container) return;
    dragRef.current = {
      active: true,
      startX: e.pageX,
      scrollLeft: container.scrollLeft,
      moved: false,
    };
    setIsDragging(true);
  };

  const onContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !containerRef.current) return;
    const dx = e.pageX - dragRef.current.startX;
    if (Math.abs(dx) > 4) dragRef.current.moved = true;
    containerRef.current.scrollLeft = dragRef.current.scrollLeft - dx;
  };

  const onFilterClick = (value: string) => {
    if (dragRef.current.moved) return;
    onChange(value);
  };

  const onContainerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!canScroll) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollFilters("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollFilters("right");
    }
  };

  useEffect(() => {
    const activeButton = buttonRefs.current[active];
    const container = containerRef.current;
    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const scrollLeft =
        activeButton.offsetLeft - containerRect.width / 2 + buttonRect.width / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [active]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateFades();
    requestAnimationFrame(updateFades);
    const delayedUpdate = window.setTimeout(updateFades, 150);

    container.addEventListener("scroll", updateFades, { passive: true });
    window.addEventListener("resize", updateFades);
    window.addEventListener("mouseup", endDrag);

    const onWheel = (e: WheelEvent) => {
      const { scrollWidth, clientWidth } = container;
      if (scrollWidth <= clientWidth + 4) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener("wheel", onWheel, { passive: false });

    const observer = new ResizeObserver(updateFades);
    observer.observe(container);

    return () => {
      window.clearTimeout(delayedUpdate);
      container.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", updateFades);
      window.removeEventListener("mouseup", endDrag);
      container.removeEventListener("wheel", onWheel);
      observer.disconnect();
    };
  }, [filters, updateFades, endDrag]);

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="relative max-w-[1600px] mx-auto">
        {canScroll && showLeftFade && (
          <button
            type="button"
            onClick={() => scrollFilters("left")}
            aria-label="Scroll filters left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-page/60 backdrop-blur-sm text-primary-700 hover:bg-page/80 hover:text-primary-900 transition-colors"
          >
            <ChevronIcon direction="left" />
          </button>
        )}

        {canScroll && showRightFade && (
          <button
            type="button"
            onClick={() => scrollFilters("right")}
            aria-label="Scroll filters right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-page/60 backdrop-blur-sm text-primary-700 hover:bg-page/80 hover:text-primary-900 transition-colors"
          >
            <ChevronIcon direction="right" />
          </button>
        )}

        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-0 top-0 bottom-0 w-14 md:w-24 z-10",
            "bg-gradient-to-r from-page from-15% via-page/95 to-transparent",
            "transition-opacity duration-300",
            showLeftFade ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-0 top-0 bottom-0 w-14 md:w-24 z-10",
            "bg-gradient-to-l from-page from-15% via-page/95 to-transparent",
            "transition-opacity duration-300",
            showRightFade ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          ref={containerRef}
          role="group"
          aria-label="Filter gallery"
          tabIndex={canScroll ? 0 : undefined}
          title={canScroll ? "Scroll with mouse wheel, drag, or arrows" : undefined}
          onMouseDown={onContainerMouseDown}
          onMouseMove={onContainerMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onKeyDown={onContainerKeyDown}
          className={cn(
            "flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth select-none",
            canScroll && "px-6",
            canScroll && (isDragging ? "cursor-grabbing" : "cursor-grab")
          )}
        >
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              ref={(el) => {
                buttonRefs.current[f.value] = el;
              }}
              onClick={() => onFilterClick(f.value)}
              aria-pressed={active === f.value}
              className={cn(
                "shrink-0 px-6 py-2 text-xs tracking-[0.2em] uppercase font-light transition-all duration-300 whitespace-nowrap border-b-2",
                active === f.value
                  ? "text-primary-900 border-primary-600 hover:text-primary-700 hover:border-primary-500"
                  : "text-primary-700 border-transparent hover:text-primary-900 hover:border-primary-400 hover:bg-primary-900/5"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {canScroll && (
          <p className="sr-only">
            Filter list scrolls horizontally. Use arrow buttons, mouse wheel, drag, or swipe to see more categories.
          </p>
        )}
      </div>
    </div>
  );
}
