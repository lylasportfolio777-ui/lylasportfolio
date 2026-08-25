"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { createClient } from "@/utils/supabase/client";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

const DEFAULT_PRICING_PLANS = [
  {
    name: "Portrait Session",
    price: "$1,200",
    description: "Intimate, high-end portraiture focusing on character and light.",
    features: ["2 Hour Session", "Studio or Location", "15 Retouched Images", "Online Gallery"],
    featured: false,
    ctaText: "Inquire Now",
  },
  {
    name: "Editorial Feature",
    price: "$3,500",
    description: "Full-day conceptual shoot designed for publications and lookbooks.",
    features: ["8 Hour Session", "Creative Direction", "Full Lookbook", "Commercial Rights"],
    featured: true,
    ctaText: "Inquire Now",
  },
  {
    name: "Global Campaign",
    price: "Custom",
    description: "Large scale productions for international brands and agencies.",
    features: ["Multi-day Shoot", "Full Production Team", "Global Usage Rights", "Art Direction"],
    featured: false,
    ctaText: "Inquire Now",
  },
];

interface PricingSectionProps {
  config?: Record<string, string>;
}

export default function PricingSection({ config }: PricingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [plans, setPlans] = useState<any[]>(() => {
    if (config?.pricing_plans) {
      try {
        const parsed = JSON.parse(config.pricing_plans);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* use fallback */ }
    }
    return DEFAULT_PRICING_PLANS;
  });

  const [dataLoaded, setDataLoaded] = useState(false);
  const isCarousel = plans.length > 3;

  useEffect(() => {
    if (config?.pricing_plans) {
      try {
        const parsed = JSON.parse(config.pricing_plans);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlans(parsed);
          setDataLoaded(true);
          return;
        }
      } catch { /* proceed to fetch */ }
    }

    const fetchPricing = async () => {
      try {
        const supabase = createClient();
        const { data: configData } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "pricing_plans")
          .single();

        if (configData?.value) {
          const parsed = JSON.parse(configData.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPlans(parsed);
            return;
          }
        }
      } catch {
        /* Fallback */
      } finally {
        setDataLoaded(true);
      }
    };

    fetchPricing();
  }, [config]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [dataLoaded, plans]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -420, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 420, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-18 md:py-18 px-4 sm:px-6 md:px-12  overflow-hidden select-none"
    >
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center relative">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1C1D20]/50 block mb-4 md:mb-6">
              Investment
            </span>
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-normal tracking-tight text-[#1C1D20] leading-none">
              Clear pricing.
            </h2>
          </div>

          {isCarousel && (
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button
                onClick={handleScrollLeft}
                aria-label="Previous pricing option"
                className="w-12 h-12 rounded-full border border-[#1C1D20]/20 flex items-center justify-center text-[#1C1D20] hover:bg-[#1C1D20] hover:text-[#FAFAF7] transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleScrollRight}
                aria-label="Next pricing option"
                className="w-12 h-12 rounded-full border border-[#1C1D20]/20 flex items-center justify-center text-[#1C1D20] hover:bg-[#1C1D20] hover:text-[#FAFAF7] transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div
          ref={scrollContainerRef}
          className={
            isCarousel
              ? "flex gap-6 sm:gap-8 lg:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              : "grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch"
          }
        >
          {plans.map((plan, i) => (
            <div
              key={plan.id || i}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={`flex flex-col justify-between p-8 sm:p-10 md:p-12 relative group rounded-2xl transition-transform duration-500 hover:-translate-y-2 ${
                plan.featured 
                  ? "bg-[#1C1D20] text-[#FAFAF7] shadow-2xl" 
                  : "bg-white text-[#1C1D20] shadow-sm"
              } ${isCarousel ? "w-[85vw] sm:w-[400px] lg:w-[calc(33.333%-1.35rem)] shrink-0 snap-start" : ""}`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl md:text-2xl tracking-tight font-medium">
                    {plan.name}
                  </h3>
                  {plan.featured && (
                    <span className="text-[10px] font-mono uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                      Signature
                    </span>
                  )}
                </div>
                
                <p className={`text-sm leading-relaxed mb-10 ${plan.featured ? "text-white/60" : "text-[#1C1D20]/60"}`}>
                  {plan.description}
                </p>

                <div className={`mb-10 pb-10 border-b ${plan.featured ? "border-white/10" : "border-[#1C1D20]/10"}`}>
                  <span className="text-4xl md:text-5xl lg:text-6xl tracking-tight font-light">
                    {plan.price}
                  </span>
                </div>

                <ul className="flex flex-col gap-4 mb-12">
                  {Array.isArray(plan.features) && plan.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-4 text-sm md:text-base">
                      <span className={`text-[10px] ${plan.featured ? "text-white/40" : "text-[#1C1D20]/40"}`}>✦</span>
                      <span className={plan.featured ? "text-white/90" : "text-[#1C1D20]/90"}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/book" className="w-full block mt-auto">
                <button
                  className={`group/btn w-full py-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] transition-all duration-300 border-b ${
                    plan.featured
                      ? "border-white/30 hover:border-white text-white"
                      : "border-[#1C1D20]/20 hover:border-[#1C1D20] text-[#1C1D20]"
                  }`}
                >
                  {plan.ctaText || "Inquire Now"}
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
