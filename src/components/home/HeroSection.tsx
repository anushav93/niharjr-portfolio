"use client";

import { motion } from "framer-motion";

type HeroSectionProps = {
  tagline: string;
  title: string;
  description: string;
};

export default function HeroSection({ tagline, title, description }: HeroSectionProps) {
  return (
    <section className="relative min-h-[800px] flex flex-col justify-center items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/50 to-surface pointer-events-none z-10" />
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "4rem" }}
        transition={{ duration: 1, ease: "circOut" }}
        className="absolute top-0 left-12 w-1 bg-primary-500 hidden md:block"
      />
      <div className="container mx-auto px-6 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-block mb-6"
        >
          <p className="text-sm tracking-[0.4em] uppercase text-primary-600 font-medium mb-2">
            {tagline}
          </p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="h-px bg-primary-400 mx-auto"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif max-w-5xl mx-auto text-6xl md:text-7xl lg:text-8xl mb-8 leading-tight tracking-tight"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-subtext max-w-2xl mx-auto leading-relaxed font-light"
          >
            {description}
          </motion.p>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-16 bg-gradient-to-b from-primary-400 to-transparent mx-auto" />
      </motion.div>
    </section>
  );
}
