"use client";

import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import { gsap } from "@/lib/gsap";

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Synchronize Lenis smooth scroll ticker directly with GSAP ticker loop
    // Prevents dual-frame tearing, stuttering, and wheel input delays
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        autoRaf: false,
        syncTouch: true,
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
