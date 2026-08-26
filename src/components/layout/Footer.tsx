"use client";

import { useRef, useEffect, useMemo } from "react";
import { gsap } from "@/lib/gsap";
import SplitType from "split-type";
import Magnetic from "@/components/ui/Magnetic";
import Link from "next/link";

interface FooterProps {
  config?: Record<string, string>;
}

export default function Footer({ config = {} }: FooterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const contactData = useMemo(
    () => ({
      contact_email: config.contact_email || "studio@emiledurand.com",
      contact_phone: config.contact_phone || "+33 1 45 67 89 01",
      contact_description:
        config.contact_description ||
        "Available for editorial commissions, commercial campaigns, and fine art collaborations. Based in Paris, working worldwide.",
      contact_studio: config.contact_studio || "24 Rue de Rivoli\n75001 Paris, France",
      social_instagram: config.social_instagram || "#",
      social_behance: config.social_behance || "#",
      social_vimeo: config.social_vimeo || "#",
      social_linkedin: config.social_linkedin || "#",
    }),
    [config]
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (!sectionRef.current) return;

      const ctx = gsap.context(() => {
        // Dynamic Overflow Curve Enter (Top)
        gsap.to("#footer-top-curve", {
          attr: { d: "M0,100 Q50,100 100,100 L100,100 L0,100 Z" }, // Flat
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top top",
            scrub: true,
          },
        });
        
        gsap.set("#footer-top-curve", {
          attr: { d: "M0,100 Q50,0 100,100 L100,100 L0,100 Z" },
        });

        if (headingRef.current) {
          const split = new SplitType(headingRef.current, { types: "chars" });
          gsap.fromTo(
            split.chars,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.015,
              duration: 0.9,
              ease: "power4.out",
              scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
            }
          );
        }

        if (contentRef.current) {
          const items = contentRef.current.querySelectorAll(".contact-item");
          gsap.fromTo(
            items,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: contentRef.current, start: "top 85%", once: true },
            }
          );
        }
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="min-h-screen flex flex-col pt-16 md:pt-20 pb-6 px-4 sm:px-6 md:px-12 bg-[#1C1D20] text-[#FAFAF7] relative mt-auto"
    >
      {/* Top SVG Overflow Curve */}
      <div className="absolute top-0 left-0 w-full h-[60px] sm:h-[90px] -translate-y-[99%] z-20 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-[#1C1D20] drop-shadow-[0_-10px_25px_rgba(0,0,0,0.15)]">
          <path id="footer-top-curve" d="M0,100 Q50,0 100,100 L100,100 L0,100 Z" />
        </svg>
      </div>

      {/* Background subtle noise/gradient could go here if needed */}
      <div className="max-w-[1400px] w-full mx-auto flex flex-col justify-between flex-grow">
        {/* Header Heading */}
        <div className="mb-8 md:mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-white/50 block mb-4 md:mb-6">
            Contact
          </span>
          <h2
            ref={headingRef}
            className="text-[clamp(3rem,12vw,10rem)] tracking-[-0.04em] leading-[0.9] font-normal"
          >
            Let&rsquo;s create<br />
            something beautiful
          </h2>
        </div>

        {/* Content Layout */}
        <div
          ref={contentRef}
          className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-12 border-t border-white/10 pt-8 md:pt-10 flex-grow"
        >
          {/* Left Side: Contact Information & Nav Links */}
          <div className="w-full md:col-span-6 lg:col-span-5 contact-item flex flex-col justify-between h-full">
            <div>
              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-sm whitespace-pre-line font-light">
                {contactData.contact_description}
              </p>

              <div className="space-y-6 mb-8">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 block mb-2 font-mono">
                    Email
                  </span>
                  <a
                    href={`mailto:${contactData.contact_email}`}
                    className="hover-target relative inline-block text-lg md:text-xl tracking-[-0.01em] transition-colors hover:text-white/70 overflow-hidden group"
                  >
                    {contactData.contact_email}
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform origin-left transition-transform duration-300 scale-x-100 group-hover:scale-x-0" />
                  </a>
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 block mb-2 font-mono">
                    Phone
                  </span>
                  <a
                    href={`tel:${contactData.contact_phone}`}
                    className="hover-target relative inline-block text-lg md:text-xl tracking-[-0.01em] transition-colors hover:text-white/70 overflow-hidden group"
                  >
                    {contactData.contact_phone}
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform origin-left transition-transform duration-300 scale-x-100 group-hover:scale-x-0" />
                  </a>
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 block mb-2 font-mono">
                    Studio
                  </span>
                  <p className="text-base md:text-lg tracking-[-0.01em] text-white/80 whitespace-pre-line font-light">
                    {contactData.contact_studio}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-mono">
                Navigation
              </span>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                {[
                  { label: "Home", href: "/" },
                  { label: "Portfolio", href: "/portfolio" },
                  { label: "Services", href: "/#services" },
                  { label: "About", href: "/about" },
                  { label: "FAQ", href: "/faq" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="hover-target text-white/70 hover:text-white transition-colors text-sm font-medium hover:underline underline-offset-4 decoration-white/30"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: CTA Button & Social Footer */}
          <div className="w-full md:col-span-6 lg:col-span-6 lg:col-start-7 flex flex-col justify-between items-center md:items-end contact-item h-full">
            <div className="hidden md:flex items-center justify-center w-full md:w-auto my-8 md:my-0 md:mr-12">
              <Magnetic strength={30}>
                <a
                  href={`mailto:${contactData.contact_email}`}
                  className="hover-target group relative inline-flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full border border-white/20  transition-all duration-700 bg-transparent shadow-2xl"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm tracking-[0.15em] uppercase text-white  transition-colors duration-500 font-medium text-center">
                      Start a<br />project
                    </span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="text-white group-hover:text-[#1C1D20] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500"
                    >
                      <path d="M5 15L15 5M15 5H8M15 5V12" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* Rotating Circular Text */}
                  <svg
                    className="absolute inset-0 w-full h-full animate-spin pointer-events-none group-hover:opacity-0 transition-opacity duration-500"
                    style={{ animationDuration: "20s" }}
                    viewBox="0 0 200 200"
                  >
                    <defs>
                      <path
                        id="circle"
                        d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                      />
                    </defs>
                    <text className="fill-white/30 text-[10px] sm:text-[11px] tracking-[0.45em] uppercase font-mono">
                      <textPath href="#circle">
                        PHOTOGRAPHY • VISUAL DIRECTION • EDITORIAL •{" "}
                      </textPath>
                    </text>
                  </svg>
                </a>
              </Magnetic>
            </div>

            {/* Social Links & Copyright Footer Bar */}
            <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-4 mt-0 md:mt-auto pt-6 border-t border-white/10">
              <span className="text-white/40 text-[10px] tracking-[0.1em] uppercase font-mono">
                © 2026 lyla's photography developed by <a href="https://www.instagram.com/ferbcode.ms?igsi=MWloNHF3d3hhZ3luNg==" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors duration-300 border-b border-transparent hover:border-white/30 pb-0.5">ferbcode.ms</a>
              </span>
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                {[
                  { name: "Instagram", url: contactData.social_instagram },
                  { name: "Behance", url: contactData.social_behance },
                  { name: "Vimeo", url: contactData.social_vimeo },
                  { name: "LinkedIn", url: contactData.social_linkedin },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-target text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300 font-mono"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
