"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full px-6 lg:px-8 h-20 flex items-center justify-between text-neutral-900 dark:text-white bg-white dark:bg-black border-b border-neutral-400 dark:border-neutral-600">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/njrlogo.svg"
            alt="Nihar J Reddy"
            className="h-8 w-8 brightness-0 dark:invert"
          />
          <span className="text-base font-medium tracking-tight">NJ Reddy</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          <li>
            <Link
              className={`hover:text-blue-600 transition-all uppercase tracking-widest font-light px-2 py-1 rounded-full ${
                pathname === "/"
                  ? "text-white bg-orange-500 hover:bg-orange-400 hover:text-white"
                  : ""
              }`}
              href="/"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className={`hover:text-blue-600 transition-all uppercase tracking-widest font-light px-2 py-1 rounded-full ${
                pathname === "/gallery"
                  ? "text-white bg-green-500 hover:bg-green-400 hover:text-white"
                  : ""
              }`}
              href="/gallery"
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              className={`hover:text-blue-600 transition-all uppercase tracking-widest font-light px-2 py-1 rounded-full ${
                pathname === "/about"
                  ? "text-white bg-amber-500 hover:bg-amber-400 hover:text-white"
                  : ""
              }`}
              href="/about"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              className={`hover:text-blue-600 transition-all uppercase tracking-widest font-light px-2 py-1 rounded-full ${
                pathname === "/contact"
                  ? "text-white bg-blue-500 hover:bg-blue-400 hover:text-white"
                  : ""
              }`}
              href="/contact"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5 z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-current transition-all ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-current transition-all ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-current transition-all ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white dark:bg-black transition-all duration-500 md:hidden ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <ul className="flex flex-col items-center gap-8 text-2xl">
            <li>
              <Link
                className={`hover:text-blue-600 transition-all uppercase tracking-widest font-light ${
                  pathname === "/" ? "text-blue-600" : ""
                }`}
                href="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className={`hover:text-blue-600 transition-all uppercase tracking-widest font-light ${
                  pathname === "/gallery" ? "text-blue-600" : ""
                }`}
                href="/gallery"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                className={`hover:text-blue-600 transition-all uppercase tracking-widest font-light ${
                  pathname === "/about" ? "text-blue-600" : ""
                }`}
                href="/about"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                className={`hover:text-blue-600 transition-all uppercase tracking-widest font-light ${
                  pathname === "/contact" ? "text-blue-600" : ""
                }`}
                href="/contact"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
