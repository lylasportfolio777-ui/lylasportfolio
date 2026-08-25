"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Preloader from "@/components/home/Preloader";
import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";

// Dynamically import below-the-fold components to reduce initial JS payload
const FeaturedProjects = dynamic(() => import("@/components/home/FeaturedProjects"), {
  ssr: true,
});
const ServicesSection = dynamic(() => import("@/components/home/ServicesSection"), {
  ssr: true,
});
const TestimonialsSection = dynamic(() => import("@/components/home/TestimonialsSection"), {
  ssr: true,
});
const PricingSection = dynamic(() => import("@/components/home/PricingSection"), {
  ssr: true,
});
const Footer = dynamic(() => import("@/components/layout/Footer"), {
  ssr: true,
});

interface HomeClientProps {
  config: Record<string, string>;
  initialProjects?: any[];
  initialServices?: any[];
  initialTestimonials?: any[];
}

export default function HomeClient({ 
  config,
  initialProjects = [],
  initialServices = [],
  initialTestimonials = []
}: HomeClientProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("aura_preloader_done")) {
      setIsLoading(false);
    }
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("aura_preloader_done", "true");
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <Preloader onComplete={handlePreloaderComplete} config={config} />
      )}
      <main className="bg-background min-h-screen overflow-x-hidden w-full max-w-[100vw]">
        <Hero config={config} />
        <AboutSection config={config} />
        <FeaturedProjects initialProjects={initialProjects} />
        <ServicesSection initialServices={initialServices} />
        <TestimonialsSection initialTestimonials={initialTestimonials} />
        <PricingSection config={config} />
        <Footer config={config} />
      </main>
    </>
  );
}
