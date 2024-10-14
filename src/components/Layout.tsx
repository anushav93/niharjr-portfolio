
import React, { ReactElement } from 'react';
import { Noto_Sans } from "next/font/google";
import Navbar from './Navbar';

const noto = Noto_Sans({ subsets: ['latin'] });

type LayoutProps = {
    children: ReactElement;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={`flex flex-col min-h-screen ${noto.className}`}>
            <header className="sticky top-0">
                {/* Your header content goes here */}
                <Navbar/>
            </header>
            
            <main className="flex-grow">
                {children}
            </main>
            
            <footer className="bg-gray-800 text-white py-4 px-6">
                {/* Your footer content goes here */}
            </footer>
        </div>
    );
};
export default Layout;