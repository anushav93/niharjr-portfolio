import React, { ReactElement } from "react";
import { IBM_Plex_Sans } from "next/font/google";
import Navbar from "./Navbar";
import HeadWithMetas from "./HeadWithMetas";

const noto =  IBM_Plex_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap"
});

type LayoutProps = {
  children: ReactElement;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={`flex flex-col min-h-screen ${noto.className}`}>
      <HeadWithMetas
        title="Nihar J Reddy"
        description="Nihar J Reddy - Photographer + civil engineer"
        scripts={[]}
        image={{
          url: "/njr-social.png",
        }}
      />
      <header className="sticky top-0 z-[200]">
        {/* Your header content goes here */}
        <Navbar />
      </header>

      <main className="flex-grow">{children}</main>

      <footer className=" py-4 px-6">
        {/* Your footer content goes here */}
      </footer>
    </div>
  );
};
export default Layout;
