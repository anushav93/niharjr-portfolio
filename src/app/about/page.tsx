import { getAboutPage, getImageUrl } from "@/lib/contentful";
import CornerFrameButton from "@/components/CornerFrameButton";

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

export default async function AboutPage() {
  // Fetch about page content from Contentful CMS
  const aboutData = await getAboutPage();
  
  // Get portrait image URL
  const portraitImageUrl = aboutData?.story?.portraitImage
    ? getImageUrl(aboutData.story.portraitImage, { width: 800, height: 1000, format: 'webp', quality: 85 })
    : '/images/about.jpg';

  return (
    <div className="min-h-screen bg-stone-200">
      {/* About Header with accent */}
      <div className="relative">
        <div className="absolute top-20 left-0 w-24 h-1 bg-primary-500" />
        
        <div className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
          <div className="inline-block mb-4">
            <p className="text-xs tracking-[0.3em] uppercase text-primary-600 mb-2 font-medium">
              About
            </p>
            <div className="h-px w-full bg-primary-400" />
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-text-primary mb-6 leading-tight">
            {aboutData?.hero?.title || 'Nihar J Reddy'}
          </h1>
          
          <p className="text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {aboutData?.hero?.subtitle || 'Visual storyteller based in Australia'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Portrait with accent border */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-32 h-32 border-t-2 border-l-2 border-primary-400" />
            <div className="aspect-[3/4] overflow-hidden bg-neutral-100 relative z-10">
              <img
                src={portraitImageUrl}
                alt="Photographer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-b-2 border-r-2 border-primary-400" />
          </div>

          {/* Story */}
          <div className="space-y-8 flex flex-col justify-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="font-serif text-3xl md:text-4xl text-text-primary">
                  {aboutData?.story?.mainTitle || 'Creating Visual Narratives'}
                </h2>
              </div>
              
              <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
                {aboutData?.story?.storyParagraphs?.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                )) || (
                  <>
                    <p>
                      Professional photographer with a passion for capturing authentic moments
                      and creating compelling visual narratives that resonate.
                    </p>
                    <p>
                      Specializing in natural light photography, with a focus on composition,
                      emotion, and storytelling through imagery.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Skills */}
            {aboutData?.story?.skills && aboutData.story.skills.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {aboutData.story.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 text-xs tracking-wider uppercase bg-primary-50 text-primary-700 border border-stone-300 font-medium transition-all hover:bg-primary-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Approach Section with visual divider */}
      <section className="py-20 px-6 md:px-12 mt-12">
        <div className="max-w-6xl mx-auto">
          {/* Divider */}
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1 bg-border-default" />
            <div className="w-2 h-2 bg-primary-500 rounded-full" />
            <div className="h-px flex-1 bg-border-default" />
          </div>

          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-4">
              {aboutData?.approach?.sectionTitle || 'Approach'}
            </h2>
            <p className="text-sm text-text-secondary max-w-2xl mx-auto">
              {aboutData?.approach?.sectionDescription || 'Core principles that guide every photograph'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {(aboutData?.approach?.principles || [
              {
                icon: "01",
                title: "Craft",
                description: "Meticulous attention to light, composition, and detail",
              },
              {
                icon: "02",
                title: "Vision",
                description: "Strong creative perspective and artistic direction",
              },
              {
                icon: "03",
                title: "Story",
                description: "Every frame captures authentic moments and emotions",
              },
            ]).map((item, idx) => (
              <div key={item.title} className="relative group">
                <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-primary-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-6 text-center">
                  <p className="text-4xl font-light text-primary-400 mb-4">
                    {item.icon}
                  </p>
                  <h3 className="font-serif text-xl text-text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-primary-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with corner frame buttons */}
      <section className="py-20 px-6 text-center border-t border-border-default mt-12">
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-4">
            {aboutData?.callToAction?.title || "Let's Work Together"}
          </h2>
          <p className="text-sm text-text-secondary">
            {aboutData?.callToAction?.description || 'Available for commissions and collaborations'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <CornerFrameButton href="/gallery">
            {aboutData?.callToAction?.primaryButtonText || 'View Work'}
          </CornerFrameButton>
          
          <CornerFrameButton href="/contact">
            {aboutData?.callToAction?.secondaryButtonText || 'Get In Touch'}
          </CornerFrameButton>
        </div>
      </section>
    </div>
  );
}
