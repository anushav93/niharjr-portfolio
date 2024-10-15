import Layout from "@/components/Layout";

export const images = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpeg",
  "/images/4.jpeg",
  "/images/5.jpeg",
  "/images/6.jpeg",
];

const About: React.FC = () => {
  return (
    <Layout>
      <>
        <div className="mt-12 mb-6 px-4 md:px-8 flex flex-row flex-wrap items-end gap-x-3 ">
          <h1 className="font-medium text-6xl text-blue-600">CREATING </h1>{" "}
          <h1 className="text-4xl italic font-extralight text-blue-600">
            VISUAL PEACE
          </h1>
        </div>
        <div className="overflow-hidden flex flex-row relative">
          <div className="flex flex-row gap-x-6 animate-marquee whitespace-nowrap">
            {images &&
              images.map((img: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="w-60 h-60 bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                  ></div>
                );
              })}
          </div>

          <div className="absolute top-0 left-6 flex flex-row gap-x-6 animate-marquee2 whitespace-nowrap">
            {images &&
              images.map((img: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="w-60 h-60 bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                  ></div>
                );
              })}
          </div>
        </div>
        <div className="px-4 md:px-8 flex flex-col pt-12 ">
          <div className="grid grid-cols-12 pt-24">
            <div className="col-span-12 md:col-span-4"></div>
            <div className="col-span-12 md:col-span-6">
              <h1 className="text-xs font-medium mb-4 uppercase text-blue-500">
                About Me
              </h1>
              <h4 className="text-lg">
                A professional photographer capturing the light and emotions in
                my way.
                <br />
                <br />
                Skilled in capturing nature, action, candid moments, can create
                beautiful, authentic, and meaningful photographs that capture
                the essence of weddings and events.
              </h4>
            </div>
          </div>
        </div>
      </>
    </Layout>
  );
};

export default About;
