"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

const hardcodedServices = [
  { id: 1, name: "Editorial Photography", category: "Fashion & Editorial", image_url: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547568/samples/people/kitchen-bar.jpg" },
  { id: 2, name: "Commercial Campaigns", category: "Advertising & Commercial", image_url: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/look-up.jpg" },
  { id: 3, name: "Brand Identity", category: "Creative Direction", image_url: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547581/samples/balloons.jpg" },
  { id: 4, name: "Art Direction", category: "Visual Strategy", image_url: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547581/samples/smile.jpg" },
  { id: 5, name: "Lookbook & Catalog", category: "Fashion Lookbook", image_url: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547581/samples/smile.jpg" },
];

interface ServicesSectionProps {
  initialServices?: any[];
}

const slideVariants: Variants = {
  initial: (direction: "up" | "down") => ({
    y: direction === "down" ? "100%" : "-100%",
    opacity: 0.85,
  }),
  animate: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.76, 0, 0.24, 1] as const,
    },
  },
  exit: (direction: "up" | "down") => ({
    y: direction === "down" ? "-100%" : "100%",
    opacity: 0.85,
    transition: {
      duration: 0.45,
      ease: [0.76, 0, 0.24, 1] as const,
    },
  }),
};

export default function ServicesSection({ initialServices = [] }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openMobileIndex, setOpenMobileIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"up" | "down">("down");

  const services = initialServices.length > 0 ? initialServices : hardcodedServices;

  // Track last mouse position
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hoveredIndexRef = useRef<number | null>(null);
  hoveredIndexRef.current = hoveredIndex;

  // GSAP quickTo position smooth tracking
  const xTo = useRef<any>(null);
  const yTo = useRef<any>(null);

  useEffect(() => {
    if (previewRef.current) {
      gsap.set(previewRef.current, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
      xTo.current = gsap.quickTo(previewRef.current, "x", { duration: 0.4, ease: "power2.out" });
      yTo.current = gsap.quickTo(previewRef.current, "y", { duration: 0.4, ease: "power2.out" });
    }
  }, []);

  // GSAP scroll triggers for rows reveal and dynamic SVG overflow curves
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Dynamic Overflow Curve Enter (Top)
      if (sectionRef.current) {
        gsap.to("#top-curve", {
          attr: { d: "M0,100 Q50,100 100,100 L100,100 L0,100 Z" }, // Animates to flat
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%", // Starts flattening when top reaches 60% of viewport
            end: "top top",   // Fully flat when it reaches the top
            scrub: true,
          },
        });
        
        // Starts fully curved (y=0) when off-screen and entering
        gsap.set("#top-curve", {
          attr: { d: "M0,100 Q50,0 100,100 L100,100 L0,100 Z" },
        });

        // 2. Dynamic Overflow Curve Exit (Bottom)
        gsap.to("#bottom-curve", {
          attr: { d: "M0,0 Q50,100 100,0 L100,0 L0,0 Z" }, // Animates to bowed down
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom bottom", // Starts bowing as soon as bottom enters viewport
            end: "bottom 40%",      // Fully bowed when bottom reaches 40% of viewport
            scrub: true,
          },
        });
        
        // Starts flat
        gsap.set("#bottom-curve", {
          attr: { d: "M0,0 Q50,0 100,0 L100,0 L0,0 Z" },
        });
      }

      // 3. Rows reveal
      rowsRef.current.forEach((row) => {
        if (!row) return;
        gsap.fromTo(
          row,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 90%", once: true },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [services]);

  // Helper to force hide modal
  const hidePreviewModal = () => {
    if (hoveredIndexRef.current !== null) {
      setHoveredIndex(null);
    }
    if (previewRef.current) {
      gsap.to(previewRef.current, { scale: 0, opacity: 0, duration: 0.1, ease: "power2.in" });
    }
  };

  // Check if cursor is strictly inside section bounds
  const isCursorInsideSection = (x: number, y: number): boolean => {
    if (!sectionRef.current) return false;
    const rect = sectionRef.current.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };

  // Global mousemove and scroll handlers with strict section boundary checks
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      lastMouse.current = { x: e.clientX, y: e.clientY };

      if (!isCursorInsideSection(e.clientX, e.clientY)) {
        hidePreviewModal();
        return;
      }

      if (xTo.current && yTo.current) {
        xTo.current(e.clientX);
        yTo.current(e.clientY);
      }
    };

    const handleGlobalScroll = () => {
      if (lastMouse.current.x === 0 && lastMouse.current.y === 0) return;

      // Check if mouse is within section boundaries on scroll
      if (!isCursorInsideSection(lastMouse.current.x, lastMouse.current.y)) {
        hidePreviewModal();
        return;
      }

      if (xTo.current && yTo.current) {
        xTo.current(lastMouse.current.x);
        yTo.current(lastMouse.current.y);
      }

      // Check element currently under cursor during scroll
      const targetEl = document.elementFromPoint(lastMouse.current.x, lastMouse.current.y);
      if (targetEl) {
        const rowEl = targetEl.closest("[data-service-index]");
        if (rowEl) {
          const idxAttr = rowEl.getAttribute("data-service-index");
          if (idxAttr !== null) {
            const idx = parseInt(idxAttr, 10);
            if (!isNaN(idx)) {
              if (hoveredIndexRef.current !== idx) {
                if (hoveredIndexRef.current !== null) {
                  setDirection(idx > hoveredIndexRef.current ? "down" : "up");
                }
                setHoveredIndex(idx);
                if (previewRef.current) {
                  gsap.to(previewRef.current, { scale: 1, opacity: 1, duration: 0.1, ease: "power3.out" });
                }
              }
              return;
            }
          }
        }
      }

      hidePreviewModal();
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("scroll", handleGlobalScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("scroll", handleGlobalScroll);
    };
  }, []);

  const handleMouseEnter = (index: number) => {
    if (hoveredIndex !== null && index !== hoveredIndex) {
      setDirection(index > hoveredIndex ? "down" : "up");
    }
    setHoveredIndex(index);

    if (previewRef.current) {
      gsap.to(previewRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
      });
    }
  };

  const handleMouseLeave = () => {
    hidePreviewModal();
  };

  const toggleMobileRow = (index: number) => {
    setOpenMobileIndex((prev) => (prev === index ? null : index));
  };

  const activeService = hoveredIndex !== null ? services[hoveredIndex] : null;

  return (
    <section 
      ref={sectionRef} 
      onMouseLeave={handleMouseLeave}
      className="py-16 sm:py-32 px-4 sm:px-6 md:px-12 bg-[#1C1D20] text-[#FAFAF7] relative select-none"
    >
      {/* Top SVG Overflow Curve */}
      <div className="absolute top-0 left-0 w-full h-[40px] sm:h-[80px] md:h-[120px] -translate-y-[99%] z-20 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-[#1C1D20] drop-shadow-[0_-10px_25px_rgba(0,0,0,0.15)]">
          <path id="top-curve" d="M0,100 Q50,0 100,100 L100,100 L0,100 Z" />
        </svg>
      </div>

      {/* Bottom SVG Overflow Curve */}
      <div className="absolute bottom-0 left-0 w-full h-[40px] sm:h-[80px] md:h-[120px] translate-y-[99%] z-20 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-[#1C1D20] drop-shadow-[0_10px_25px_rgba(0,0,0,0.15)]">
          <path id="bottom-curve" d="M0,0 Q50,0 100,0 L100,0 L0,0 Z" />
        </svg>
      </div>

      {/* Desktop Floating Cursor Preview Modal */}
      <div
        ref={previewRef}
        className="fixed top-0 left-0 w-72 h-80 sm:w-80 sm:h-96 md:w-[580px] md:h-[500px] pointer-events-none z-50 overflow-hidden shadow-xl bg-[#e7e3de] dark:bg-[#1a1918] p-5 sm:py-25 sm:px-10 border border-black/10 dark:border-white/10 hidden md:block transform-gpu"
        style={{ willChange: "transform" }}
      >
        <div className="relative w-full h-full overflow-hidden bg-black/5">
          <AnimatePresence custom={direction} mode="popLayout">
            {activeService && (
              <motion.div
                key={activeService.id || hoveredIndex}
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 w-full h-full transform-gpu"
              >
                <Image
                  src={getOptimizedCloudinaryUrl(activeService.image_url, 600)}
                  alt={activeService.name}
                  fill
                  className="object-cover"
                  sizes="580px"
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <span className="text-xs font-mono uppercase tracking-widest text-white/50 block mb-12 sm:mb-20">
          Services
        </span>

        <div 
          className="space-y-0 border-t border-white/10"
          onMouseLeave={handleMouseLeave}
        >
          {services.map((service, index) => {
            const isMobileOpen = openMobileIndex === index;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={service.id || index}
                data-service-index={index}
                ref={(el) => { rowsRef.current[index] = el; }}
                onMouseEnter={() => handleMouseEnter(index)}
                onClick={() => toggleMobileRow(index)}
                className={`group border-b border-white/10 py-6 sm:py-10 md:py-16 flex flex-col justify-between transition-all duration-500 hover:bg-white/[0.02] px-2 sm:px-6 cursor-pointer ${hoveredIndex !== null && !isHovered ? 'opacity-40' : 'opacity-100'}`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 sm:gap-12 w-full md:w-auto">
                    <span className="font-mono text-sm text-white/40 hidden md:block">
                      0{index + 1}
                    </span>
                    <h2 className="text-[clamp(2.5rem,5.5vw,5.5rem)] font-normal tracking-[-0.02em] uppercase leading-none transition-transform duration-700 ease-[0.19,1,0.22,1] group-hover:translate-x-6 text-white">
                      {service.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-6 sm:gap-12 w-full md:w-auto justify-between md:justify-end">
                    <span className="font-mono text-xs text-white/50 tracking-[0.2em] uppercase transition-colors duration-300 group-hover:text-white">
                      {service.category}
                    </span>

                    {/* Mobile Plus/Minus Toggle Icon */}
                    <span className="font-mono text-2xl text-white/50 md:hidden font-light">
                      {isMobileOpen ? "−" : "+"}
                    </span>
                  </div>
                </div>

                {/* Mobile Tap-to-Expand Image Drawer */}
                <AnimatePresence>
                  {isMobileOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                      className="overflow-hidden md:hidden mt-8"
                    >
                      <div className="relative w-full aspect-video overflow-hidden rounded-sm bg-black/5">
                        <Image
                          src={getOptimizedCloudinaryUrl(service.image_url, 600)}
                          alt={service.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
