"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  images: string[];
  rows?: number;
  cols?: number;
  gap?: number; // px gap between tiles
  aspect?: "photo" | "square" | "video";
  lensRadius?: number; // px radius of reveal
  speed?: number; // seconds per sweep loop
  className?: string;
};

export default function AnimatedImageStack({
  images,
  rows = 3,
  cols = 5,
  gap = 12,
  aspect = "photo",
  lensRadius = 500,
  speed = 18,
  className = "",
}: Props) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const resolvedRows = isMobile ? 4 : rows;
  const resolvedCols = isMobile ? 3 : cols;
  const resolvedGap = isMobile ? 4 : gap;
  const resolvedLensRadius = isMobile ? 170 : lensRadius;

  const total = Math.max(1, resolvedRows * resolvedCols);

  // repeat images to fill grid
  const tiles = useMemo(() => {
    if (!images?.length) return [];
    const out: string[] = [];
    for (let i = 0; i < total; i++) out.push(images[i % images.length]);
    return out;
  }, [images, total]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // autopilot: diagonal/lissajous sweep across the grid
  useEffect(() => {
    if (prefersReduced) return; // respect OS setting
    let raf = 0;
    let start = performance.now();
    const loop = (now: number) => {
      if (pos) return; // pointer is in control
      const t = ((now - start) / 1000) % speed;
      const progress = t / speed; // 0..1

      const el = containerRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        // Lissajous-ish path for nicer motion
        const x =
          r.width *
          (0.1 + 0.8 * (1.5 + 1.5 * Math.sin(2 * Math.PI * (progress + 0.05))));
        const y =
          r.height *
          (0.1 + 0.8 * (1.5 + 1.5 * Math.sin(2 * Math.PI * (progress * 0.67))));
        el.style.setProperty("--lx", `${x}px`);
        el.style.setProperty("--ly", `${y}px`);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pos, speed, prefersReduced]);

  const setPointer = (clientX: number, clientY: number) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = clientX - r.left;
    const y = clientY - r.top;
    containerRef.current?.style.setProperty("--lx", `${x}px`);
    containerRef.current?.style.setProperty("--ly", `${y}px`);
    setPos({ x, y });
  };

  const clearPointer = () => setPos(null);

  const aspectClass =
    aspect === "video"
      ? "aspect-video"
      : aspect === "square"
      ? "aspect-square"
      : "aspect-[4/3]";

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={
        {
          // side fade so the grid breathes inside the hero space
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          // CSS vars for lens position (autopilot sets these; pointer overrides too)
          // @ts-ignore – custom props are fine
          "--lx": "40%",
          "--ly": "50%",
        } as React.CSSProperties
      }
      onMouseMove={(e) => setPointer(e.clientX, e.clientY)}
      onMouseLeave={clearPointer}
      onTouchStart={(e) =>
        setPointer(e.touches[0].clientX, e.touches[0].clientY)
      }
      onTouchMove={(e) =>
        setPointer(e.touches[0].clientX, e.touches[0].clientY)
      }
      onTouchEnd={clearPointer}
      aria-hidden
    >
      {/* Base grayscale layer */}
      <Grid
        tiles={tiles}
        rows={resolvedRows}
        cols={resolvedCols}
        gap={resolvedGap}
        aspectClass={aspectClass}
        grayscale
      />

      {/* Color layer with sweeping mask */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage: `radial-gradient(${resolvedLensRadius}px ${resolvedLensRadius}px at var(--lx) var(--ly), black 75%, transparent 100%)`,
          maskImage: `radial-gradient(${resolvedLensRadius}px ${resolvedLensRadius}px at var(--lx) var(--ly), black 75%, transparent 100%)`,
        }}
      >
        <Grid
          tiles={tiles}
          rows={resolvedRows}
          cols={resolvedCols}
          gap={resolvedGap}
          aspectClass={aspectClass}
          className="saturate-125 contrast-[1.06]"
        />
      </div>

      {/* polish: soft ring + grain + vignette */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 dark:ring-white/10" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light grain" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_50%,rgba(0,0,0,0),rgba(0,0,0,.16))]" />

      <style jsx>{`
        .grain {
          background-image: url("data:image/svg+xml;utf8,\
          <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>\
            <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/></filter>\
            <rect width='120' height='120' filter='url(%23n)' opacity='0.55'/>\
          </svg>");
          background-size: 120px 120px;
        }
        @media (prefers-reduced-motion: no-preference) {
          .ken-a {
            animation: ken 19s ease-in-out infinite alternate;
          }
          .ken-b {
            animation: ken 23s ease-in-out infinite alternate;
          }
          @keyframes ken {
            0% {
              transform: scale(1.02) translate3d(-6px, -3px, 0);
            }
            100% {
              transform: scale(1.075) translate3d(8px, 5px, 0);
            }
          }
        }
      `}</style>
    </div>
  );
}

/** Grid renderer reused for grayscale base + color overlay */
function Grid({
  tiles,
  rows,
  cols,
  gap,
  aspectClass,
  grayscale = false,
  className = "",
}: {
  tiles: string[];
  rows: number;
  cols: number;
  gap: number;
  aspectClass: string;
  grayscale?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`grid ${grayscale ? "grayscale" : ""} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap,
      }}
    >
      {tiles.map((src, i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-lg ${aspectClass}`}
        >
          <Image
            src={src}
            alt=""
            fill
            className={`object-cover ${i % 2 ? "ken-a" : "ken-b"}`}
            sizes="(min-width:1280px) 18vw, (min-width:768px) 30vw, 45vw"
            priority={i < cols}
          />
          <span className="pointer-events-none absolute inset-0 ring-1 ring-black/10 dark:ring-white/10 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
