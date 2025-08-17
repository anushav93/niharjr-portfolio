import Container from "./components/Container";
import PageHero from "./components/PageHero";
import SectionHeading from "./components/SectionHeading";
import PhotoCard from "./components/PhotoCard";
import Typography from "@/components/Typography";
import Button from "@/components/Button";

// Reuse existing static images for hero for now
const heroPhotos = [
  { src: "/images/1.jpeg", alt: "Featured 1" },
  { src: "/images/2.jpeg", alt: "Featured 2" },
  { src: "/images/3.jpeg", alt: "Featured 3" },
  { src: "/images/4.jpeg", alt: "Featured 4" },
  { src: "/images/5.jpeg", alt: "Featured 5" },
  { src: "/images/6.jpeg", alt: "Featured 6" },
];

export default function HomePage() {
  // Minimal copy; photo-first. For featured series/latest, we can reuse static images as placeholders.
  const featured = heroPhotos;
  const latest = [
    { src: "/images/4.jpeg" },
    { src: "/images/5.jpeg" },
    { src: "/images/6.jpeg" },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section with border */}
      <section className="border-b border-neutral-400 dark:border-neutral-600">
        <PageHero photos={heroPhotos} />
      </section>

      {/* Mission statement section with full width and border */}
      <section className="py-20 border-b border-neutral-900">
        <div className="w-full px-6 lg:px-8">
          <div className="text-center">
            <Typography variant="h2" fontWeight="light" className="mb-4">
              Every Frame Tells a Story
            </Typography>
            <Typography variant="p" className="max-w-3xl mx-auto">
              Through my lens, I capture the extraordinary in the ordinary,
              creating visual narratives that resonate with emotion and
              authenticity.
            </Typography>
          </div>
        </div>
      </section>

      {/* Three-column grid with vertical dividers - full width */}
      <section className="relative border-b border-neutral-900 ">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y divide-neutral-900 md:divide-y-0 md:divide-x">
            {[
              {
                label: "NATURE",
                title: "Landscapes",
                body: "Capturing the raw beauty and serene moments found in natural environments, from mountains to coastlines.",
                href: "/gallery?filter=Nature+and+the+Landscapes",
              },
              {
                label: "CONSTRUCTION SITE",
                title: "People",
                body: "A collection of portraits and candid moments that tell the stories of individuals from diverse backgrounds.",
                href: "/gallery?filter=Construction+Site",
              },
              {
                label: "HEARTS",
                title: "Melting hearts",
                body: "A series focused on capturing intimate and heartfelt connections between people.",
                href: "/gallery?filter=Melting+Hearts",
              },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="block p-8 md:p-12 lg:p-16 focus-visible:outline-current  transition-all duration-300 group"
              >
                <Typography variant="small" className="mt-8 uppercase">
                  {item.label}
                </Typography>
                <Typography
                  variant="h3"
                  className="mt-8 group-hover:text-blue-600 transition-colors duration-300 ease-in-out"
                  fontWeight="light"
                >
                  {item.title}
                </Typography>
                <Typography variant="p" className="mt-4 md:mt-6">
                  {item.body}
                </Typography>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured work section with full width and border */}
      <section className="pt-20 ">
        <div className="w-full  space-y-16">
          <div className="text-center">
            <Typography variant="small" className="mb-6 uppercase">
              Featured Work
            </Typography>
            <Typography variant="h2" fontWeight="light" className="mb-4 mt-8">
              Latest Captures
            </Typography>
            <Typography variant="p" className="mt-6 max-w-3xl mx-auto">
              A curated selection of my most recent work, showcasing diverse
              styles and subjects.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-neutral-900">
            {featured.map((p, idx) => (
              <div
                key={idx}
                className="group p-4  transition-all duration-700 ease-in-out border-r border-neutral-900"
              >
                <div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-800 aspect-[4/5]">
                  <img
                    src={p.src}
                    alt={p.alt || "Featured work"}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="flex justify-center pb-32">
        <Button href="/gallery" className="w-full text-center" variant="light">
          View All Work
        </Button>
      </div>
    </div>
  );
}
