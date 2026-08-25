"use client";

import { useRef, useEffect, useMemo } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SplitType from "split-type";

interface AboutSectionProps {
  config: Record<string, string>;
}

export default function AboutSection({ config }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const leftSvgRef = useRef<SVGSVGElement>(null);
  const rightSvgRef = useRef<SVGSVGElement>(null);

  const aboutData = useMemo(() => ({
    about_heading: config.about_heading || "A quiet obsession\nwith light\nand form.",
    about_text_p1: config.about_text_p1 || "I believe photography exists at the intersection of patience and instinct. Every frame I create begins with observation — studying how light shapes a space, how shadow carves depth, how a single moment can contain an entire story.",
    about_text_p2: config.about_text_p2 || "With over a decade behind the lens, my work spans editorial fashion, architectural documentation, and fine art photography. I shoot exclusively on medium format, preserving every nuance of tone and texture.",
    about_image: config.about_image || "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547581/samples/smile.jpg",
    about_caption_left: config.about_caption_left || "Self portrait, Paris 2025",
    about_caption_right: config.about_caption_right || "Hasselblad X2D",
    about_stat_1_val: config.about_stat_1_val || "12+",
    about_stat_1_lbl: config.about_stat_1_lbl || "Years Experience",
    about_stat_2_val: config.about_stat_2_val || "200+",
    about_stat_2_lbl: config.about_stat_2_lbl || "Projects",
    about_stat_3_val: config.about_stat_3_val || "15",
    about_stat_3_lbl: config.about_stat_3_lbl || "Awards",
  }), [config]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text lines reveal
      if (textRef.current) {
        const paragraphs = textRef.current.querySelectorAll("p, h2");
        paragraphs.forEach((p) => {
          if ((p as any)._splitDone) return;
          (p as any)._splitDone = true;
          const split = new SplitType(p as HTMLElement, { types: "lines" });
          gsap.fromTo(split.lines,
            { y: 40, opacity: 0 },
            {
              y: 0, opacity: 1, stagger: 0.08, duration: 1, ease: "power3.out",
              scrollTrigger: { trigger: p, start: "top 85%" },
            }
          );
        });
      }

      // Smooth Parallax/Rotation on Left SVG
      if (leftSvgRef.current) {
        gsap.to(leftSvgRef.current, {
          rotate: 180,
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        });
      }

      // Smooth Parallax on Right SVG
      if (rightSvgRef.current) {
        gsap.to(rightSvgRef.current, {
          y: 80,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        });
      }

      // Leave Section Animation (Exit effect at the bottom)
      if (textRef.current) {
        gsap.to(textRef.current, {
          y: -60,
          opacity: 0,
          scale: 0.95,
          filter: "blur(10px)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom 75%", // Starts animating when bottom of section is 85% down viewport
            end: "bottom 20%",
            scrub: 1,
          }
        });
      }

      if (leftSvgRef.current && rightSvgRef.current) {
        gsap.to(leftSvgRef.current, {
          x: -100,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom 85%",
            end: "bottom 20%",
            scrub: 1,
          }
        });
        
        gsap.to(rightSvgRef.current, {
          x: 100,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom 85%",
            end: "bottom 20%",
            scrub: 1,
          }
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-24 md:py-32 px-6 md:px-12 w-full flex items-center justify-center min-h-[60vh] overflow-hidden">
      
      {/* Left Floating Camera Lens */}
      <div className="absolute left-[-50%] sm:left-[-30%] md:left-[-10%] lg:left-4 top-[10%] md:top-[20%] pointer-events-none z-0 opacity-[0.5] md:opacity-[0.5]">
        <svg 
          ref={leftSvgRef}
          viewBox="0 0 200 200" 
          className="w-[160px] h-[160px] md:w-[320px] md:h-[320px] text-foreground" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5"
        >
          {/* Outer Lens Rings */}
          <circle cx="100" cy="100" r="95" strokeWidth="0.25" />
          <circle cx="100" cy="100" r="85" />
          <circle cx="100" cy="100" r="78" strokeDasharray="2 4" strokeWidth="0.5" />
          
          {/* Inner Sensor / Focus Ring */}
          <circle cx="100" cy="100" r="30" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="28" strokeWidth="0.25" />
          <circle cx="100" cy="100" r="5" fill="currentColor" opacity="0.5" />
          
          {/* Aperture Blades */}
          <g strokeWidth="0.5">
            <line x1="100" y1="70" x2="145" y2="40" />
            <line x1="126" y1="85" x2="175" y2="100" />
            <line x1="126" y1="115" x2="145" y2="160" />
            <line x1="100" y1="130" x2="55" y2="160" />
            <line x1="74" y1="115" x2="25" y2="100" />
            <line x1="74" y1="85" x2="55" y2="40" />
          </g>
        </svg>
      </div>

      {/* Right Floating Viewfinder Specs */}
      <div className="absolute right-[-40%] sm:right-[-20%] md:right-[-5%] lg:right-12 bottom-[5%] md:bottom-[15%] pointer-events-none z-0 opacity-[0.3] md:opacity-[0.5]">
        <svg 
          ref={rightSvgRef}
          viewBox="0 0 100 100" 
          className="w-[120px] h-[120px] md:w-[220px] md:h-[220px] text-foreground" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5"
        >
          {/* Viewfinder Corners */}
          <path d="M10,30 L10,10 L30,10" />
          <path d="M70,10 L90,10 L90,30" />
          <path d="M90,70 L90,90 L70,90" />
          <path d="M30,90 L10,90 L10,70" />
          
          {/* Center Crosshair */}
          <line x1="45" y1="50" x2="55" y2="50" strokeWidth="0.25" />
          <line x1="50" y1="45" x2="50" y2="55" strokeWidth="0.25" />
          
          {/* Tech Spec Text */}
          <text x="15" y="85" className="text-[6px] tracking-widest font-mono" fill="currentColor" stroke="none">ISO 400</text>
          <text x="65" y="85" className="text-[6px] tracking-widest font-mono" fill="currentColor" stroke="none">F/2.8</text>
          
          {/* Exposure Meter Grid */}
          <line x1="20" y1="15" x2="20" y2="25" strokeWidth="0.25" />
          <line x1="25" y1="17" x2="25" y2="23" strokeWidth="0.25" />
          <line x1="30" y1="15" x2="30" y2="25" strokeWidth="0.25" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-auto flex flex-col items-center text-center" ref={textRef}>
        <span className="section-label block mb-8 relative overflow-hidden">
          <span className="inline-block" ref={(el) => {
            if (el && !(el as any)._splitDone) {
              (el as any)._splitDone = true;
              gsap.fromTo(el, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, scrollTrigger: { trigger: el, start: "top 90%" } });
            }
          }}>Philosophy</span>
        </span>

        <h2 className="text-3xl md:text-5xl lg:text-6xl tracking-[-0.03em] leading-[1.15] mb-6 whitespace-pre-line font-light text-foreground">
          {aboutData.about_heading}
        </h2>

        {aboutData.about_text_p1 && (
          <p className="text-muted-foreground text-sm md:text-base leading-[1.7] max-w-xl font-light mb-10">
            {aboutData.about_text_p1}
          </p>
        )}

        <Link href="/about" className="group inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.25em] font-medium border-b border-foreground/30 pb-2 hover:border-foreground transition-colors text-foreground">
          <span>Read Full Story</span>
          <span className="relative overflow-hidden w-4 h-4 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 absolute transform transition-transform group-hover:translate-x-full group-hover:-translate-y-full" />
            <ArrowUpRight className="w-4 h-4 absolute transform -translate-x-full translate-y-full transition-transform group-hover:translate-x-0 group-hover:translate-y-0" />
          </span>
        </Link>
      </div>
    </section>
  );
}
