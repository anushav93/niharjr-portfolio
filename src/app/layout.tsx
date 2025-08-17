import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Photography portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Ensure Tailwind uses the sans stack */}
      <body className="font-sans antialiased">
        <header className="fixed top-0 left-0 right-0 z-50  bg-white dark:bg-neutral-950">
          <Navbar />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
