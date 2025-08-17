import React, { ReactElement } from "react";
import Navbar from "./Navbar";
import HeadWithMetas from "./HeadWithMetas";

type LayoutProps = {
  children: ReactElement;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={"flex flex-col min-h-screen font-sans antialiased"}>
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
