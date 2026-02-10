"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type FeaturedProject = {
  src: string;
  alt: string;
  title: string;
  href: string;
};

type FeaturedSectionProps = {
  projects: FeaturedProject[];
};

export default function FeaturedSection({ projects }: FeaturedSectionProps) {
  return (
    <section className="px-4 md:px-8 pb-24">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-border-default" />
          <p className="text-xs tracking-[0.3em] uppercase text-primary-600 font-medium">
            Recent Projects
          </p>
          <div className="h-px flex-1 bg-border-default" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <Link
                href={project.href}
                className="group block relative aspect-[4/5] overflow-hidden bg-neutral-100"
              >
                <motion.img
                  src={project.src}
                  alt={project.alt}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <div className="w-full border-b border-white/30 pb-4">
                    <p className="text-white font-serif text-2xl italic tracking-wide">
                      {project.title}
                    </p>
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
