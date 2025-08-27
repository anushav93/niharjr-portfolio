import Button from "@/components/Button";
import Container from "@/components/Container";
import SectionHeading from "../components/SectionHeading";
import Typography from "@/components/Typography";
import { getAboutPage, urlFor } from "@/lib/sanity";

// Force revalidation on every request
export const revalidate = 0;

export default async function AboutPage() {
  // Fetch about page content from Sanity CMS
  const aboutData = await getAboutPage();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 border-b border-neutral-900 ">
        <div className="w-full px-6 lg:px-8">
          <div className="text-center">
            <Typography
              variant="small"
              className="mb-6 uppercase px-2 py-1 bg-amber-500 text-white rounded-full"
            >
              About
            </Typography>
            <Typography variant="h1" fontWeight="light" className="mb-4 mt-8">
              {aboutData?.hero?.title || 'Nihar J Reddy'}
            </Typography>
            <Typography variant="p" className="max-w-3xl mx-auto">
              {aboutData?.hero?.subtitle || 'Visual storyteller, photographer, and creative director'}
            </Typography>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 border-b border-neutral-900">
        <div className="w-full px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-6xl mx-auto">
            {/* Portrait */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  {aboutData?.story?.portraitImage ? (
                    <img
                      src={urlFor(aboutData.story.portraitImage).width(800).height(1000).url()}
                      alt="Nihar J Reddy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/images/about.jpg"
                      alt="Nihar J Reddy"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                  <div className="text-2xl font-bold">{aboutData?.story?.yearsExperience || 5}+</div>
                  <div className="text-sm opacity-90">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Story */}
            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <Typography variant="h2" fontWeight="light" className="mb-6">
                  {aboutData?.story?.mainTitle || 'Creating Visual Narratives'}
                </Typography>
                <div className="space-y-6">
                  {aboutData?.story?.storyParagraphs?.map((paragraph, index) => (
                    <Typography key={index} variant="p">
                      {paragraph}
                    </Typography>
                  )) || (
                    <>
                      <Typography variant="p">
                        I'm a professional photographer with a passion for capturing
                        the extraordinary in the ordinary. My work spans across
                        nature, portraits, and event photography, with each image
                        telling a unique story.
                      </Typography>
                      <Typography variant="p">
                        Skilled in capturing natural light, authentic emotions, and
                        candid moments, I create beautiful, meaningful photographs
                        that preserve the essence of special occasions and everyday
                        beauty.
                      </Typography>
                      <Typography variant="p">
                        When I'm not behind the camera, I'm exploring new
                        techniques, studying the work of masters, and constantly
                        pushing the boundaries of visual storytelling.
                      </Typography>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {aboutData?.story?.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                )) || (
                  <>
                    {[
                      "Photography",
                      "Visual Storytelling",
                      "Event Coverage",
                      "Portrait Sessions",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 border-neutral-900">
        <div className="w-full ">
          <div className="text-center mb-16">
            <Typography variant="h2" fontWeight="light" className="mb-4">
              {aboutData?.approach?.sectionTitle || 'My Approach'}
            </Typography>
            <Typography variant="p" className="max-w-3xl mx-auto">
              {aboutData?.approach?.sectionDescription || 'Three core principles guide every shot I take and every story I tell through my lens.'}
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-b divide-x divide-y md:divide-y-0 divide-neutral-900 border-neutral-900 ">
            {(aboutData?.approach?.principles || [
              {
                icon: "🎨",
                title: "Craft",
                description: "Meticulous attention to light, color, and composition creates images that stand the test of time.",
              },
              {
                icon: "📐",
                title: "Composition",
                description: "Strong geometric principles and visual balance create calm, harmonious imagery that draws the viewer in.",
              },
              {
                icon: "📖",
                title: "Storytelling",
                description: "Every frame captures human moments and emotions, anchored in place and purpose to tell meaningful stories.",
              },
            ]).map((item, idx) => (
              <div
                key={item.title}
                className="bg-white dark:bg-neutral-800 p-8 md:p-12 lg:p-16 text-center transition-all duration-300"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <Typography variant="h3" fontWeight="light" className="mb-6">
                  {item.title}
                </Typography>
                <Typography variant="p">{item.description}</Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width CTA Section */}
      <section className="bg-white dark:bg-neutral-950 border-b border-neutral-900">
        <div className="py-20 px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-8">
          <Typography variant="h2" fontWeight="light" className="mb-6">
            {aboutData?.callToAction?.title || "Let's Create Something Beautiful"}
          </Typography>
          <Typography variant="p">
            {aboutData?.callToAction?.description || 'Ready to capture your special moments? I\'d love to discuss your vision and bring it to life.'}
          </Typography>
        </div>
        </div>
        <div className=" flex justify-center pb-32">
          <Button href="/gallery" variant="light">
            {aboutData?.callToAction?.primaryButtonText || 'View My Work'}
          </Button>
          <Button href="/contact" variant="dark">
            {aboutData?.callToAction?.secondaryButtonText || 'Get In Touch'}
          </Button>
        </div>
      </section>
    </div>
  );
}
