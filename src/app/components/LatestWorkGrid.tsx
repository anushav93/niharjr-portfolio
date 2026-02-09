"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type WorkImage = {
  src: string;
  alt: string;
  title: string;
};

type LatestWorkGridProps = {
  images: WorkImage[];
};

export default function LatestWorkGrid({ images }: LatestWorkGridProps) {
  return (
    <section className="px-4 md:px-8 pb-24">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-border-default" />
          <p className="text-xs tracking-[0.3em] uppercase text-primary-600 font-medium">
            Latest Captures
          </p>
          <div className="h-px flex-1 bg-border-default" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {images.map((image, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                href="/gallery"
                className="group block relative aspect-[3/4] overflow-hidden bg-neutral-100"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-90"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-light tracking-widest uppercase mb-2">
                      {image.title}
                    </p>
                    <div className="w-8 h-px bg-white/60 mx-auto" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
