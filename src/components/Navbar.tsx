"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Gallery", href: "/gallery" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <nav className="border-b border-b-stone-300 fixed top-0 left-0 right-0 z-50 w-full px-6 lg:px-8 h-24 flex items-center justify-between bg-stone-200  transition-all duration-300">
      {/* Logo with accent */}
      <Link href="/" className="flex items-center relative group">
        <Image
          src="/logo.png"
          alt="NEGA+IVE"
          width={120}
          height={40}
          className="h-10 w-auto transition-all duration-300 group-hover:brightness-110"
          priority
        />
        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
      </Link>

      {/* Desktop Navigation with enhanced active states */}
      <ul className="hidden md:flex items-center gap-10">
        {navigation.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="relative group"
            >
              <span className={`text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 ${
                isActive(item.href)
                  ? "text-primary-600"
                  : "text-text-secondary group-hover:text-primary-600"
              }`}>
                {item.name}
              </span>
              
              {/* Active indicator */}
              {isActive(item.href) ? (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600" />
              ) : (
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 z-50 relative group"
        aria-label="Toggle menu"
      >
        <span
          className={`w-6 h-0.5 bg-primary-600 transition-all duration-300 ${
            mobileMenuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-primary-600 transition-all duration-300 ${
            mobileMenuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-primary-600 transition-all duration-300 ${
            mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-bg-primary/98 backdrop-blur-lg transition-all duration-500 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <ul className="flex flex-col items-center gap-8">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative group"
                >
                  <span className={`text-2xl tracking-[0.2em] uppercase font-light transition-all ${
                    isActive(item.href)
                      ? "text-primary-600"
                      : "text-text-primary group-hover:text-primary-600"
                  }`}>
                    {item.name}
                  </span>
                  
                  {isActive(item.href) && (
                    <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary-500" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
