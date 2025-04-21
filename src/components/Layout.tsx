import React, { ReactElement } from "react";
import { Noto_Sans } from "next/font/google";
import Navbar from "./Navbar";
import HeadWithMetas from "./HeadWithMetas";

const noto = Noto_Sans({ subsets: ["latin"] });

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
      <header className="sticky top-0">
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
