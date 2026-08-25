"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import Link from "next/link";

interface AboutContentProps {
  config?: Record<string, string>;
}

export default function AboutContent({ config = {} }: AboutContentProps) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }
    })
  };

  const aboutHeading = config.about_heading || "A quiet obsession with light and form.";
  const aboutTextP1 = config.about_text_p1 || "I believe photography exists at the intersection of patience and instinct. Every frame I create begins with observation — studying how light shapes a space, how shadow carves depth, how a single moment can contain an entire story.";
  const aboutTextP2 = config.about_text_p2 || "With over a decade behind the lens, my work spans editorial fashion, architectural documentation, and fine art photography. I shoot exclusively on medium format, preserving every nuance of tone and texture.";
  const aboutImage = config.about_image || "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547569/samples/people/smiling-man.jpg";
  const craftHeading = config.about_craft_heading || "The Craft & Process";
  const craftP1 = config.about_craft_p1 || "Every project is approached as a bespoke artistic commission. We do not rely on standard templates or digital shortcuts. From pre-production mood boards and location scouting to custom lighting direction on set, every element is curated to evoke raw, timeless emotion.";
  const craftP2 = config.about_craft_p2 || "Utilizing high-resolution medium format systems alongside specialized vintage glass, we ensure maximum chromatic fidelity and dynamic range — crafting heirlooms meant to be appreciated across generations.";
  const marqueeRaw = config.about_marquee_text || "Vogue • Harper's Bazaar • GQ • Vanity Fair";
  const marqueeItems = marqueeRaw.split("•").map(s => s.trim()).filter(Boolean);
  const fullMarquee = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <main ref={containerRef} className="min-h-screen bg-light text-dark pt-32 selection:bg-dark selection:text-light">
      
      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />
        
        <div className="mt-12 flex flex-col items-center text-center">
          <motion.span 
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[10px] uppercase tracking-[0.3em] text-gray mb-8 font-mono"
          >
            The Artist Behind the Lens
          </motion.span>
          
          <motion.h1 
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[clamp(2.5rem,6vw,5.5rem)] tracking-[-0.03em] leading-[1.1] mb-12 uppercase font-light max-w-4xl whitespace-pre-line"
          >
            {aboutHeading}
          </motion.h1>
        </div>
      </div>

      {/* Split Content Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
        
        {/* Left: Sticky Image */}
        <div className="lg:col-span-5 relative h-[70vh] lg:h-[85vh] w-full overflow-hidden rounded-sm lg:sticky lg:top-8">
          <motion.div style={{ y: yImage }} className="absolute inset-0 -top-[20%] -bottom-[20%]">
            <Image
              src={aboutImage}
              alt="Photographer Portrait"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </div>

        {/* Right: Scrolling Text */}
        <div className="lg:col-span-7 flex flex-col justify-center pt-8 lg:pt-20">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="mb-20"
          >
            {(aboutTextP1 || aboutTextP2) ? (
              <div className="space-y-8 text-lg md:text-xl font-light text-dark/70 leading-relaxed max-w-2xl">
                {aboutTextP1 ? <p>{aboutTextP1}</p> : null}
                {aboutTextP2 ? <p>{aboutTextP2}</p> : null}
              </div>
            ) : null}
          </motion.div>

          {(craftP1 || craftP2) ? (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="mb-20"
            >
              <h2 className="text-3xl md:text-5xl tracking-[-0.02em] mb-8 font-light">{craftHeading}</h2>
              <div className="space-y-6 text-base md:text-lg font-light text-dark/70 leading-relaxed max-w-2xl">
                {craftP1 ? <p>{craftP1}</p> : null}
                {craftP2 ? <p>{craftP2}</p> : null}
              </div>
            </motion.div>
          ) : null}

          {/* Quick Stats / Facts */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="grid grid-cols-3 gap-8 border-t border-dark/10 pt-12 max-w-2xl"
          >
            <div>
              <span className="text-4xl md:text-5xl font-light mb-2 block tracking-tighter">{config.about_stat_1_val || "12+"}</span>
              <span className="text-xs uppercase tracking-widest text-gray font-mono">{config.about_stat_1_lbl || "Years Experience"}</span>
            </div>
            <div>
              <span className="text-4xl md:text-5xl font-light mb-2 block tracking-tighter">{config.about_stat_2_val || "200+"}</span>
              <span className="text-xs uppercase tracking-widest text-gray font-mono">{config.about_stat_2_lbl || "Projects"}</span>
            </div>
            <div>
              <span className="text-4xl md:text-5xl font-light mb-2 block tracking-tighter">{config.about_stat_3_val || "15"}</span>
              <span className="text-xs uppercase tracking-widest text-gray font-mono">{config.about_stat_3_lbl || "Awards"}</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Massive Marquee Divider */}
      <div className="w-full overflow-hidden bg-dark text-light py-8 mb-32 flex items-center whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-8 items-center text-2xl uppercase tracking-[0.2em] font-light"
        >
          {fullMarquee.map((item, idx) => (
            <span key={idx} className="flex items-center gap-8">
              <span>{item}</span>
              <span className="text-gray/50">•</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 text-center mb-32"
      >
        <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-8">Ready to create together?</h2>
        <Link href="/book">
          <button className="px-10 py-5 bg-dark text-light rounded-full uppercase tracking-[0.15em] text-xs font-mono hover:scale-105 transition-transform duration-300">
            Inquire Now
          </button>
        </Link>
      </motion.div>

      <Footer />
    </main>
  );
}
