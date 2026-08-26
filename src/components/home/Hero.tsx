"use client";

import { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

interface HeroProps {
  config: Record<string, string>;
}

export default function Hero({ config }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const heroData = useMemo(
    () => ({
      title: config.hero_title
        ? config.hero_title.replace(" ", "\n")
        : "Lyla\nSteidl",
      subtitle:
        config.hero_subtitle ||
        "Portrait & Nature Photography \n Put-in-Bay, Ohio.",
      image:
        config.hero_image ||
        "https://res.cloudinary.com/duk94ehtq/image/upload/v1784357918/eduardo-rodriguez-SgfN_bmO4rE-unsplash_cqjcdm.jpg",
    }),
    [config]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial image curtain reveal
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.6,
            ease: "power4.inOut",
            delay: 0.2,
          }
        );
      }

      // 2. Infinite Marquee Animation
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: "none",
          duration: 25,
          repeat: -1,
        });

        gsap.fromTo(
          marqueeRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
            delay: 0.4,
          }
        );
      }

      // 3. Subtitle entrance
      if (subRef.current) {
        gsap.fromTo(
          subRef.current,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.6,
          }
        );
      }

      // 4. Parallax effect on scroll
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // 5. Curved bottom effect on scroll
      if (containerRef.current) {
        const isMobile = window.innerWidth < 768;
        const curveDepth = isMobile ? "5vh" : "15vh";
        
        gsap.fromTo(
          containerRef.current,
          {
            borderBottomLeftRadius: "0% 0vh",
            borderBottomRightRadius: "0% 0vh",
          },
          {
            borderBottomLeftRadius: `50% ${curveDepth}`,
            borderBottomRightRadius: `50% ${curveDepth}`,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100vh] overflow-hidden bg-dark-dark select-none"
    >
      {/* Background Image Container with Clip-Path Reveal */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full min-h-screen pointer-events-none overflow-hidden"
        style={{ clipPath: "inset(100% 0 0 0)" }}
      >
        <Image
          src={getOptimizedCloudinaryUrl(heroData.image, 1600, "best")}
          alt="Editorial fashion photography"
          fill
          priority
          fetchPriority="high"
          className="object-cover scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1400px, 1600px"
          quality={90}
        />
      </div>

      {/* Gradient Vignette Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />

      {/* Hero Typography & Overlays */}
      <div className="absolute inset-0 z-20 pointer-events-auto overflow-hidden">
        {/* Subtitle block */}
        <div ref={subRef} className="absolute left-8 bottom-5 md:bottom-auto md:left-auto md:right-20 md:top-[35%] md:-translate-y-1/2 max-w-[320px] text-brand-white">
          <svg className="mb-6 md:mb-10 text-brand-white" width="30" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 7l10 10" />
            <path d="M17 7v10H7" />
          </svg>
          <p className="text-xl md:text-3xl font-normal leading-tight whitespace-pre-line text-[var(--brand-bg)]">
            {heroData.subtitle}
          </p>
        </div>

        {/* Massive Marquee Title */}
        <div className="absolute bottom-[15%] md:bottom-[-2%] left-0 w-full overflow-hidden whitespace-nowrap pointer-events-none pb-4 md:pb-8 flex items-center">
          <div ref={marqueeRef} className="flex w-max whitespace-nowrap will-change-transform">
            {/* Half 1 */}
            <div className="flex items-center">
              <h1 className="text-[40vw] md:text-[15vw] tracking-[-0.04em] leading-[0.75] text-brand-white font-medium px-6 md:px-12">
                {heroData.title}
              </h1>
              <span className="text-[25vw] md:text-[10vw] text-brand-white/50 px-4">—</span>
              <span className="text-[40vw] md:text-[15vw] tracking-[-0.04em] leading-[0.75] text-brand-white font-medium px-6 md:px-12">
                {heroData.title}
              </span>
              <span className="text-[25vw] md:text-[10vw] text-brand-white/50 px-4">—</span>
            </div>
            
            {/* Half 2 (Duplicate for seamless loop) */}
            <div className="flex items-center" aria-hidden="true">
              <span className="text-[40vw] md:text-[15vw] tracking-[-0.04em] leading-[0.75] text-brand-white font-medium px-6 md:px-12">
                {heroData.title}
              </span>
              <span className="text-[25vw] md:text-[10vw] text-brand-white/50 px-4">—</span>
              <span className="text-[40vw] md:text-[15vw] tracking-[-0.04em] leading-[0.75] text-brand-white font-medium px-6 md:px-12">
                {heroData.title}
              </span>
              <span className="text-[25vw] md:text-[10vw] text-brand-white/50 px-4">—</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
