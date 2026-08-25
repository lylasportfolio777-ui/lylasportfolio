"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

interface ProjectClientProps {
  project: {
    title: string;
    category: string;
    description?: string;
    image_url: string;
    created_at?: string;
  };
  gallery: string[];
}

export default function ProjectClient({ project, gallery }: ProjectClientProps) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const optimizedHeroUrl = getOptimizedCloudinaryUrl(project.image_url, 1920);

  return (
    <main ref={containerRef} className="min-h-screen bg-light text-dark selection:bg-dark selection:text-light relative">
      
      {/* Back to Portfolio Floating Button */}
      <div className="fixed top-8 left-6 md:left-12 z-50">
        <Link href="/portfolio">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 shadow-lg border border-white/10">
            <span>←</span>
            <span>Back to Portfolio</span>
          </button>
        </Link>
      </div>

      {/* Immersive Hero Section */}
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0">
          <Image
            src={optimizedHeroUrl}
            alt={project.title}
            fill
            priority
            fetchPriority="high"
            className="object-cover"
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 pb-24 z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/70 mb-4 block font-mono">
              {project.category}
            </span>
            <h1 className="text-[clamp(3rem,8vw,7rem)] tracking-[-0.03em] leading-[1] text-white uppercase font-light">
              {project.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Project Details */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-dark/10">
        <div className="md:col-span-4 flex flex-col gap-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray font-mono block mb-2">Role</span>
            <span className="text-lg">Photography & Direction</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray font-mono block mb-2">Year</span>
            <span className="text-lg">{project.created_at ? new Date(project.created_at).getFullYear() : "2026"}</span>
          </div>
        </div>
        
        <div className="md:col-span-8">
          <h2 className="text-2xl md:text-4xl font-light leading-relaxed tracking-tight text-dark/80">
            {project.description || "A comprehensive collection of our most evocative work, exploring the intersection of light, architecture, and human emotion in a singular, unbroken narrative."}
          </h2>
        </div>
      </div>

      {/* Editorial Masonry Gallery */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-32">
        <div className="columns-1 md:columns-2 gap-8 space-y-8">
          {gallery.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.76, 0, 0.24, 1] }}
              className="relative w-full aspect-[3/4] overflow-hidden bg-black/5 rounded-sm"
            >
              <Image
                src={getOptimizedCloudinaryUrl(img, 1000)}
                alt={`${project.title} Image ${idx + 1}`}
                fill
                loading="lazy"
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={80}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Next Project / CTA */}
      <div className="w-full text-dark py-32 flex flex-col items-center justify-center text-center px-6 border-t border-dark/10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-dark/50 mb-8 font-mono">
          Like what you see?
        </span>
        <h2 className="text-[clamp(3rem,6vw,5rem)] tracking-[-0.03em] leading-[1] mb-12 uppercase font-light">
          Let&apos;s tell your <span className="italic text-gray-400">story.</span>
        </h2>
        <Link href="/book">
          <button className="px-10 py-5 bg-dark text-light rounded-full uppercase tracking-[0.15em] text-xs font-mono hover:bg-dark/80 hover:scale-105 transition-all duration-300 shadow-xl">
            Book a Session
          </button>
        </Link>
      </div>

      <Footer />
    </main>
  );
}
