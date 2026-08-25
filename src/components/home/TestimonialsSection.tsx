"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";
import { Plus, X, Star } from "lucide-react";
import { gsap } from "@/lib/gsap";

const hardcodedTestimonials = [
  {
    quote: "An extraordinary ability to find beauty in restraint. Every image delivered carries a weight and elegance that elevates our entire campaign.",
    author: "Isabelle Laurent",
    role: "Creative Director, CHANEL",
    image_url: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/man-on-a-street.jpg",
  },
  {
    quote: "Working together is like collaborating with an architect of light. The understanding of space and shadow produces images that feel timeless.",
    author: "Marcus Chen",
    role: "Art Director, AD",
    image_url: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547572/samples/people/bicycle.jpg",
  },
  {
    quote: "There is a quiet intensity to this work that sets it apart. It doesn't just photograph a moment — it distills it into something that resonates.",
    author: "Sofia Bergström",
    role: "Editor, VOGUE",
    image_url: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547568/samples/people/kitchen-bar.jpg",
  },
  {
    quote: "The attention to detail and cinematic approach completely transformed our brand's visual identity. Absolutely thrilled with the final results.",
    author: "Elena Rodriguez",
    role: "Founder, Luxe",
    image_url: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547577/samples/two-ladies.jpg",
  },
  {
    quote: "Professional, visionary, and incredibly easy to work with. The final photos exceeded all of our expectations for the editorial spread.",
    author: "David Kim",
    role: "Publisher, Kinfolk",
    image_url: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547577/samples/two-ladies.jpg",
  },
  {
    quote: "A masterclass in composition and storytelling. Each photograph speaks volumes without saying a single word. Highly recommended.",
    author: "Amelia Hayes",
    role: "Design Lead, Studio O",
    image_url: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547573/samples/people/boy-snow-hoodie.jpg",
  },
];

interface TestimonialsSectionProps {
  initialTestimonials?: any[];
}

export default function TestimonialsSection({ initialTestimonials = [] }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  // Use 6 testimonials for the grid layout
  const testimonials = (initialTestimonials.length >= 6 ? initialTestimonials : hardcodedTestimonials).slice(0, 6);
  const activeTestimonial = testimonials[activeIndex] || testimonials[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500); // Auto-cycle every 4.5 seconds

    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Animate text when active index changes
  useEffect(() => {
    if (!textRef.current) return;
    gsap.killTweensOf(textRef.current.children);
    gsap.fromTo(
      textRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );
  }, [activeIndex]);

  const renderProfileCard = (testimonial: any, index: number) => {
    const isActive = activeIndex === index;
    return (
      <div 
        key={index}
        onClick={() => setActiveIndex(index)}
        className={`relative group cursor-pointer w-full h-[140px] md:h-[180px] rounded-2xl overflow-hidden bg-[#1C1D20] text-[#FAFAF7] transition-all duration-700 ease-[0.19,1,0.22,1] ${
          isActive ? 'scale-[1.04] shadow-lg ring-1 ring-black/10' : 'scale-100 hover:scale-[1.02]'
        }`}
      >
        <Image
          src={getOptimizedCloudinaryUrl(testimonial.image_url, 400)}
          alt={testimonial.author}
          fill
          className="object-cover opacity-100"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        {/* Gradient overlay for text legibility */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
        
        <div className={`absolute bottom-4 left-4 right-4 flex justify-between items-end transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <span className="text-white font-medium text-sm md:text-base leading-tight">
            {testimonial.author}
          </span>
          
          <button 
            className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-colors ${
              isActive ? 'bg-white text-[#064420]' : 'bg-white text-[#064420]'
            }`}
          >
            {isActive ? <X size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 md:py-32 px-4 md:px-12 ">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center flex flex-col items-center">
          <span className="text-xs font-mono uppercase tracking-widest text-[#064420]/60 block mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight">
            Client Stories.
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          
          {/* Left Column (Indexes 0, 1, 2) */}
          <div className="hidden md:flex flex-col gap-4 md:gap-6 col-span-1">
            {testimonials.slice(0, 3).map((t, i) => renderProfileCard(t, i))}
          </div>

          {/* Center Active Card (Spans 2 columns) */}
          <div className="col-span-1 md:col-span-2 bg-[#1C1D20] rounded-3xl p-8 md:p-12 flex flex-col justify-between text-white shadow-xl relative overflow-hidden h-[450px] md:h-auto min-h-[500px]">
            {/* Minimal Logo Placeholder */}
            <div className="flex items-center gap-2 opacity-80">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">É</span>
              </div>
              <span className="font-mono text-sm tracking-widest uppercase">Émile</span>
            </div>

            <div ref={textRef} className="flex-grow flex flex-col justify-between">
              <div className="relative z-10 flex-grow flex flex-col justify-center py-8">
                <span className="text-5xl md:text-7xl font-serif text-white/20 absolute -top-4 -left-4 leading-none">
                  "
                </span>
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light leading-[1.3] tracking-tight relative z-10">
                  {activeTestimonial.quote}
                </blockquote>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-white/10 pt-6">
                <div>
                  <h4 className="text-lg md:text-xl font-medium mb-1">{activeTestimonial.author}</h4>
                  <p className="text-xs md:text-sm font-mono text-white/60">{activeTestimonial.role}</p>
                </div>
                
                <div className="flex gap-1 text-white">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" className="opacity-90" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Indexes 3, 4, 5) */}
          <div className="hidden md:flex flex-col gap-4 md:gap-6 col-span-1">
            {testimonials.slice(3, 6).map((t, i) => renderProfileCard(t, i + 3))}
          </div>

        </div>
      </div>
    </section>
  );
}
