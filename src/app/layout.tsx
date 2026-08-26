import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import SmoothScroller from "@/components/layout/SmoothScroller";
import CustomCursor from "@/components/layout/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import CookieConsent from "@/components/ui/CookieConsent";
import { getSiteConfig } from "@/lib/getConfig";

import { constructMetadata } from "@/lib/seo/metadata";
import { generateWebSiteSchema, generateLocalBusinessSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

export const metadata: Metadata = constructMetadata({
  title: "Lyla Steidl — Photography",
  description: "Award-winning photography portfolio. Specializing in family, maternity, newborn, senior, and couples portrait sessions as well as striking nature photography. Based in Put-in-Bay, Ohio.",
  image: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547568/samples/people/kitchen-bar.jpg"
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();

  return (
    <html lang="en" className={manrope.variable}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="antialiased grain-overlay font-sans">
        <JsonLd data={generateWebSiteSchema()} id="website-schema" />
        <JsonLd data={generateLocalBusinessSchema()} id="local-business-schema" />
        
        <SmoothScroller>
          <CustomCursor />
          <Navbar config={config} />
          {children}
        </SmoothScroller>
        <CookieConsent />
      </body>
    </html>
  );
}
