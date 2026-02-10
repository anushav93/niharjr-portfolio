import { notFound } from "next/navigation";
import { getRecentProject, getAllRecentProjects } from "@/lib/contentful";
import RecentProjectClient from "./RecentProjectClient";

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

// Generate static params for all recent projects
export async function generateStaticParams() {
  const projects = await getAllRecentProjects();
  return projects.map((project) => ({
    url: project.url,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ url: string }>;
}) {
  const { url } = await params;
  const project = await getRecentProject(url);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Recent Project`,
    description: `View the ${project.title} project gallery`,
  };
}

export default async function RecentProjectPage({
  params,
}: {
  params: Promise<{ url: string }>;
}) {
  const { url } = await params;
  const project = await getRecentProject(url);

  if (!project) {
    notFound();
  }

  // Transform assets to the format expected by ImageGrid and Lightbox
  const photos = project.assets.map((asset) => ({
    id: asset.id,
    title: asset.title,
    alt_description: asset.alt,
    urls: {
      small: `${asset.url}?w=400&fm=webp&q=80`,
      regular: `${asset.url}?w=1080&fm=webp&q=85`,
      full: asset.url,
    },
  }));

  return (
    <div className="min-h-screen bg-stone-200">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-20 left-0 w-24 h-1 bg-primary-500" />

        <div className="pt-32 pb-12 px-6 text-center max-w-4xl mx-auto">
          <div className="inline-block mb-4">
            <p className="text-xs tracking-[0.3em] uppercase text-primary-600 mb-2 font-medium">
              Recent Project
            </p>
            <div className="h-px w-full bg-primary-400" />
          </div>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-text-primary mb-4">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Gallery */}
      <RecentProjectClient photos={photos} />
    </div>
  );
}
