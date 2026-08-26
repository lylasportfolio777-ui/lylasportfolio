"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Magnetic from "@/components/ui/Magnetic";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  config?: Record<string, string>;
}

export default function Navbar({ config = {} }: NavbarProps) {
  const pathname = usePathname();
  const [navClosed, setNavClosed] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { text: config.nav_link_1_text || "Work", href: config.nav_link_1_url || "/portfolio" },
    { text: config.nav_link_2_text || "About", href: config.nav_link_2_url || "/about" },
    { text: config.nav_link_5_text || "Book", href: config.nav_link_5_url || "/book" },
  ];

  const socialLinks = [
    { text: "Instagram", href: config.social_instagram || "#" },
    { text: "Behance", href: config.social_behance || "#" },
    { text: "Vimeo", href: config.social_vimeo || "#" },
    { text: "LinkedIn", href: config.social_linkedin || "#" },
  ];

  const rawName = config.site_name || config.hero_title || "Lyla Steidl";
  const siteName = rawName.replace(/[\r\n]+/g, " ");

  const toggleNav = useCallback(() => {
    setNavClosed((prev) => {
      const nextState = !prev;
      document.documentElement.style.overflow = nextState ? "" : "hidden";
      return nextState;
    });
  }, []);

  // ESC key to close & focus trap support
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !navClosed) toggleNav();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [navClosed, toggleNav]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cleanup body scroll
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (pathname.startsWith("/admin")) return null;

  // The home page has a dark hero section, so it needs white text.
  // Other pages (like /portfolio, /book, /about) have a light background, so they need black text.
  const isHomePage = pathname === "/";
  const textColorClass = isHomePage ? "text-brand-white" : "text-black";

  // --- Framer Motion Variants ---
  
  // Easing curve (Expo/Spring mix simulation)
  const animEase: any = [0.76, 0, 0.24, 1];
  const duration = 0.8;

  const menuVariants = {
    closed: { 
      x: "100%", 
      borderTopLeftRadius: "20vw",
      borderBottomLeftRadius: "20vw",
      transition: { duration, ease: animEase } 
    },
    open: { 
      x: "0%", 
      borderTopLeftRadius: "0vw",
      borderBottomLeftRadius: "0vw",
      transition: { duration, ease: animEase } 
    }
  };

  const linkVariants = {
    closed: { opacity: 0, y: 60, filter: "blur(10px)", scale: 0.9 },
    open: (i: number) => ({
      opacity: 1, y: 0, filter: "blur(0px)", scale: 1,
      transition: { duration, ease: animEase, delay: 0.1 * i + 0.15 }
    })
  };

  const footerVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0, transition: { duration, ease: animEase, delay: 0.45 } }
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className={`absolute top-0 left-0 right-0 z-40 flex justify-between items-center w-full p-8 px-8 md:px-12 pointer-events-auto select-none transition-colors duration-500 ${isHomePage ? "text-black" : "text-brand-white"}`}>
        {/* Logo */}
        <Magnetic strength={20}>
          <Link href="/" className="group flex items-center gap-3 cursor-pointer select-none">
            <div className={`credit group-hover:rotate-180 transition-transform duration-500 text-md md:text-lg font-bold md:font-normal ${textColorClass}`}>
              <span>©</span>
            </div>
            <div className="cbd w-[136px] max-sm:w-[118px] group-hover:w-[220px] max-sm:group-hover:w-[118px] overflow-hidden transition-all duration-500">
              <p className={`code-by font-bold md:font-normal text-md md:text-lg tracking-wider text-nowrap transition-transform duration-500 transform group-hover:-translate-x-[35px] max-sm:group-hover:-translate-x-0 ${textColorClass}`}>
                {siteName}
              </p>
            </div>
          </Link>
        </Magnetic>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex gap-8 items-center justify-center">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Magnetic strength={20}>
                <Link href={link.href} className={`px-2 py-1.5 text-lg font-normal transition-colors duration-300 relative ${textColorClass}`}>
                  {link.text}
                </Link>
              </Magnetic>
            </li>
          ))}
        </ul>

        <button onClick={toggleNav} className={`md:hidden text-md font-bold md:font-normal tracking-[0.10em] transition-opacity duration-300 ${textColorClass} ${isScrolled ? "opacity-0 scale-0 pointer-events-none" : "opacity-100 scale-100 pointer-events-auto"}`}>
          Menu
        </button>
      </nav>

      {/* Floating Hamburger Button with Magnetic Effect */}
      <div className={`fixed right-6 top-6 z-[60] transform-gpu transition-all duration-300 ease-out ${isScrolled || !navClosed ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
        <Magnetic strength={30}>
          <button onClick={toggleNav} aria-label="Toggle Navigation Menu" className="relative flex items-center justify-center h-14 w-14 md:h-16 md:w-16 cursor-pointer rounded-full shadow-lg bg-brand-dark transform-gpu overflow-hidden">
            {/* Hamburger Lines (Morphs to 0 on open) */}
            <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-[6px]" animate={{ scale: navClosed ? 1 : 0, opacity: navClosed ? 1 : 0 }} transition={{ duration: 0.4, ease: animEase }}>
              <span className="h-[1.5px] w-6 bg-brand-white rounded-full" />
              <span className="h-[1.5px] w-6 bg-brand-white rounded-full" />
            </motion.div>
            {/* Close Icon (Morphs to 1 on open) */}
            <motion.div className="absolute inset-0 flex items-center justify-center" animate={{ scale: navClosed ? 0 : 1, opacity: navClosed ? 0 : 1 }} transition={{ duration: 0.4, ease: animEase }}>
              <span className="absolute h-[1.5px] w-6 bg-brand-white rotate-45 rounded-full" />
              <span className="absolute h-[1.5px] w-6 bg-brand-white -rotate-45 rounded-full" />
            </motion.div>
          </button>
        </Magnetic>
      </div>

      {/* Full Screen Animated Drawer with SVG Curve */}
      <AnimatePresence mode="wait">
        {!navClosed && (
          <motion.div 
            className="fixed right-0 top-0 h-full w-full md:w-[40vw] max-w-lg z-50 bg-brand-dark text-brand-white flex flex-col justify-between shadow-2xl transform-gpu"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >

            <div className="relative z-10 flex flex-col items-start justify-center pt-16 p-10 md:p-16 h-full">
              <h5 className="mb-6 text-xs uppercase tracking-[0.25em] text-brand-white/40 font-medium font-mono">
                Navigation
              </h5>
              <div className="h-[1px] w-full bg-brand-white/10 mb-10" />
              
              <ul className="flex flex-col gap-4 md:gap-6 w-full">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <div key={index} className="overflow-hidden">
                      <motion.li 
                        custom={index} 
                        variants={linkVariants} 
                        initial="closed" 
                        animate="open" 
                        exit="closed"
                        onClick={() => { setNavClosed(true); document.documentElement.style.overflow = ""; }}
                      >
                        <Magnetic strength={20}>
                          <Link href={link.href} className="group flex items-center gap-4 py-1 relative">
                            <span className="text-xs text-brand-white font-mono mt-1">0{index + 1}</span>
                            <div className="relative overflow-hidden">
                              <p className={`text-5xl md:text-6xl font-light tracking-tight transition-colors duration-300 ${isActive ? "text-brand-white font-normal" : "text-brand-white group-hover:text-brand-white/70"}`}>
                                {link.text}
                              </p>
                              {/* Hover Underline Reveal */}
                              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                            </div>
                          </Link>
                        </Magnetic>
                      </motion.li>
                    </div>
                  );
                })}
              </ul>

              {/* Social Links Footer */}
              <motion.div className="socials flex flex-col items-start pt-8 mt-auto w-full border-t border-brand-white/10" variants={footerVariants} initial="closed" animate="open" exit="closed">
                <h5 className="mb-4 text-[10px] uppercase tracking-[0.25em] text-brand-white/40 font-medium font-mono">
                  Socials
                </h5>
                <ul className="flex items-center justify-start gap-6 flex-wrap">
                  {socialLinks.map((link, index) => (
                    <li key={index}>
                      <Magnetic strength={10}>
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs tracking-wider uppercase text-brand-white hover:text-brand-white/70 transition-colors font-mono relative group">
                          {link.text}
                          <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-brand-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                        </a>
                      </Magnetic>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {!navClosed && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.8, ease: animEase }} 
            onClick={toggleNav} 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-pointer" 
          />
        )}
      </AnimatePresence>
    </>
  );
}
