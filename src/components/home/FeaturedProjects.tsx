"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

const defaultProjects = [
  {
    id: 1,
    title: "Ethereal Shadows",
    category: "Fashion",
    image: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/man-on-a-street.jpg",
  },
  {
    id: 2,
    title: "Concrete Poetry",
    category: "Architecture",
    image: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/man-on-a-escalator.jpg",
  },
  {
    id: 3,
    title: "Silent Echoes",
    category: "Editorial",
    image: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/look-up.jpg",
  },
  {
    id: 4,
    title: "Urban Geometry",
    category: "Street",
    image: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547581/samples/smile.jpg",
  },
  {
    id: 5,
    title: "Midnight Mirage",
    category: "Portrait",
    image: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547568/samples/people/kitchen-bar.jpg",
  },
  {
    id: 6,
    title: "Ocean Whisper",
    category: "Landscape",
    image: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547577/samples/two-ladies.jpg",
  },
  {
    id: 7,
    title: "Golden Hour",
    category: "Lifestyle",
    image: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547574/samples/people/bicycle.jpg",
  },
  {
    id: 8,
    title: "Neon Dreams",
    category: "Night",
    image: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547573/samples/people/boy-snow-hoodie.jpg",
  }
];

interface FeaturedProjectsProps {
  initialProjects?: any[];
}

export default function FeaturedProjects({ initialProjects = [] }: FeaturedProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Only use real projects if available, otherwise use defaults. Limit to 8 items for the design.
  const dynamicProjects = (initialProjects.length > 0 ? initialProjects : defaultProjects).slice(0, 8);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal for grid items
      gsap.fromTo(
        itemsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [dynamicProjects]);

  return (
    <section ref={containerRef} className="py-16 md:py-32 w-full">
      <div className="w-full px-4 md:px-12 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-12 relative text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-[#1C1D20]/50 block mb-4">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight">
            Selected Works<sup className="text-sm ml-1 opacity-50 font-light">({dynamicProjects.length})</sup>
          </h2>
          <div className="mt-8 md:mt-0 md:absolute md:right-0 md:bottom-2">
            <Link href="/portfolio" className="group flex items-center gap-1 text-xs font-bold tracking-widest border-b border-[#1C1D20] pb-1 transition-transform hover:translate-x-1">
              View All Projects
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Premium Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[6px] bg-dark/5">
          {dynamicProjects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className="relative group cursor-none overflow-hidden aspect-[4/5] bg-white"
            >
              <Link href="/portfolio" className="relative block w-full h-full hover-target">
                <Image
                  src={getOptimizedCloudinaryUrl(project.image || project.image_url, 600)}
                  alt={project.title}
                  fill
                  className="object-cover transition-all duration-[1.2s] ease-[0.19,1,0.22,1] group-hover:scale-105 group-hover:brightness-90"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  quality={90}
                />
                
                {/* Premium Hover Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 pointer-events-none">
                  {/* Top: Category & Number */}
                  <div className="flex justify-between items-start overflow-hidden">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/0 group-hover:text-white transition-colors duration-500 delay-100 translate-y-4 group-hover:translate-y-0">
                      {project.category}
                    </span>
                    <span className="text-[10px] font-mono text-white/0 group-hover:text-white/60 transition-colors duration-500 delay-150 translate-y-4 group-hover:translate-y-0">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                  </div>
                  
                  {/* Bottom: Title & Gradient Mask */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out z-0" />
                  
                  <div className="relative z-10 overflow-hidden pb-1">
                    <h3 className="text-xl md:text-2xl font-light tracking-tight text-white translate-y-[120%] group-hover:translate-y-0 transition-transform duration-700 ease-[0.19,1,0.22,1] delay-100">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
