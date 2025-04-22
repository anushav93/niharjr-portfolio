import ImageSlideshow from "@/components/ImageSlideShow";
import Layout from "@/components/Layout";
import { images } from "./about";
import SparkleButton from "@/components/SparkleButton";
import ContactModal from "@/components/ContactModal";

export default function Home() {
  return (
    <>
      <Layout>
        <div className="min-h-[90vh] flex flex-col justify-end bg-white px-4 md:px-8 mb-24">
          <div className="grid grid-cols-12 gap-x-6 gap-y-4">
            <div className="col-span-12 lg:col-span-5 xl:col-span-4">
              <div className="">
                <ImageSlideshow images={images} />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 xl:col-span-8">
              <div className="flex flex-col justify-center items-start text-left h-full">
                <h1 className="text-7xl lg:text-8xl font-base text-neutral-900 text-left mb-6">
                  NIHAR J REDDY
                </h1>
                <p className="text-neutral-900 italic text-4xl font-extralight">
                  Photographer + civil engineer
                </p>
                <div className="flex flex-row gap-4 mt-6">
                  <SparkleButton 
                    href="/gallery" 
                    variant="default"
                  >
                    View album
                  </SparkleButton>
                  <ContactModal 
                    buttonVariant="outline"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
