"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionDivider from "@/components/ui/SectionDivider";

type FeaturedProject = {
  src: string;
  alt: string;
  title: string;
  href: string;
};

type FeaturedSectionProps = {
  sectionTitle: string;
  projects: FeaturedProject[];
};

export default function FeaturedSection({ sectionTitle, projects }: FeaturedSectionProps) {
  if (projects.length === 0) return null;

  return (
    <section className="px-4 md:px-8 pb-24" aria-labelledby="featured-section-heading">
      <div className="max-w-[1600px] mx-auto">
        <SectionDivider label={sectionTitle} id="featured-section-heading" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.article
              key={project.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <Link
                href={project.href}
                className="group block relative aspect-[4/5] overflow-hidden bg-neutral-100"
              >
                <figure className="relative w-full h-full m-0">
                  <motion.div
                    className="relative w-full h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  >
                    <Image
                      src={project.src}
                      alt={project.alt || project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      quality={85}
                      className="object-cover"
                    />
                  </motion.div>
                  <figcaption className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8 pointer-events-none">
                    <div className="w-full border-b border-white/30 pb-4">
                      <h3 className="text-white font-serif text-2xl italic tracking-wide m-0">
                        {project.title}
                      </h3>
                    </div>
                  </figcaption>
                </figure>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
