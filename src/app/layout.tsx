import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nihar J Reddy Photography",
  description: "Professional photographer specializing in capturing lifes beautiful moments through creative and artistic photography",
  metadataBase: new URL("https://niharjreddy.com"),
  openGraph: {
    title: "Nihar J Reddy Photography",
    description: "Professional photographer specializing in capturing lifes beautiful moments through creative and artistic photography",
    images: [{
      url: "/images/nihar-social-optimized.webp",
      width: 1200,
      height: 630,
      alt: "Nihar J Reddy Photography"
    }],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Nihar J Reddy Photography",
    description: "Professional photographer specializing in capturing lifes beautiful moments through creative and artistic photography",
          images: ["/images/nihar-social-optimized.webp"],
    creator: "@niharjr"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Ensure Tailwind uses the sans stack */}
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
