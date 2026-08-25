/**
 * Centralized GSAP plugin registration.
 * Import this ONCE in layout.tsx instead of calling
 * gsap.registerPlugin(ScrollTrigger) in every component.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Global ScrollTrigger defaults — improves perceived performance
ScrollTrigger.config({
  ignoreMobileResize: true, // Prevents re-calculation on iOS address-bar resize
  limitCallbacks: true,     // Only fires callbacks when needed
});

export { gsap, ScrollTrigger };
