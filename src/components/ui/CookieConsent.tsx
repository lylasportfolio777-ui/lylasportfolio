"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const STORAGE_KEY = "aura_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Small delay so it doesn't compete with the preloader
      const t = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (!visible || !bannerRef.current) return;
    gsap.fromTo(
      bannerRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
    );
  }, [visible]);

  const dismiss = (choice: "accepted" | "declined") => {
    localStorage.setItem(STORAGE_KEY, choice);
    if (bannerRef.current) {
      gsap.to(bannerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => setVisible(false),
      });
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] w-[calc(100%-3rem)] max-w-2xl"
      style={{ opacity: 0 }}
      role="dialog"
      aria-label="Cookie consent"
    >
      {/* Glass card */}
      <div
        className="relative overflow-hidden rounded-sm border border-foreground/10 bg-[#FAFAF7]/80 backdrop-blur-xl shadow-2xl shadow-black/10 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
      >
        {/* Thin accent bar on left */}
        <span className="absolute left-0 top-0 h-full w-[2px] bg-accent" />

        {/* Text */}
        <div className="flex-1 pl-3">
          <p className="text-[11px] uppercase tracking-[0.25em] text-foreground/40 mb-1">
            Privacy Notice
          </p>
          <p className="text-sm text-foreground/70 leading-relaxed">
            We use cookies to improve your experience and analyse site performance.
            By continuing you agree to our use of cookies.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0 pl-3 sm:pl-0">
          <button
            onClick={() => dismiss("declined")}
            className="text-xs uppercase tracking-[0.15em] text-foreground/40 hover:text-foreground transition-colors duration-300 whitespace-nowrap"
          >
            Decline
          </button>
          <button
            onClick={() => dismiss("accepted")}
            className="text-xs uppercase tracking-[0.15em] bg-foreground text-background px-5 py-2.5 hover:bg-accent hover:text-white transition-colors duration-300 whitespace-nowrap rounded-sm"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
