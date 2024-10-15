import Layout from "@/components/Layout";
import Typography from "@/components/Typography";
import { cn } from "@/functions/cn";
import { useState } from "react";

const categories = ["All", "Landscape", "Fine Art", "Work", "Animals"];

const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  return (
    <Layout>
      <div className="min-h-[80vh] bg-white px-4 md:px-8 mt-12 mb-24">
        <div className="flex flex-row flex-wrap items-end gap-x-2 mb-12">
          <h1 className="font-medium text-6xl text-blue-600">CAPTURING </h1>{" "}
          <h1 className="text-4xl italic font-extralight text-blue-600">
            {" "}
            Moments of Serenity
          </h1>
        </div>
        <div className="flex flex-row flex-wrap gap-y-3 gap-x-4 mt-4">
          {categories.map((category) => {
            return (
              <div
                key={category}
                onClick={() => setActiveFilter(category)}
                className={cn(
                  "text-lg uppercase border-2 border-blue-600 text-blue-600 px-2 py-1 cursor-pointer transition-all duration-300 ease-in-out",
                  activeFilter === category
                    ? "bg-blue-600 text-white scale-110"
                    : "bg-white text-blue-600"
                )}
              >
                {category}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default GalleryPage;
