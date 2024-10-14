import ImageSlideshow from "@/components/ImageSlideShow";
import Layout from "@/components/Layout";
import { images } from "./about";

export default function Home() {
  return (
    <Layout>
      <div className="h-[90vh] flex flex-col justify-end bg-white px-4 md:px-8 mb-24">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <div className="">
              <ImageSlideshow images={images} />
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-8">
            <div className="flex flex-col justify-center items-start text-left h-full">
              <h1 className="text-8xl font-bold text-blue-600 text-left mb-6">
                Nihar j reddy
              </h1>
              <p className="text-blue-600 italic">
                Photographer + civil engineer
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
