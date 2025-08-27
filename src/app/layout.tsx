import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/Providers";
import ConditionalLayout from "@/components/ConditionalLayout";
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
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "t157v20ode");
            `,
          }}
        />
      </head>
      {/* Ensure Tailwind uses the sans stack */}
      <body className={inter.className}>
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
