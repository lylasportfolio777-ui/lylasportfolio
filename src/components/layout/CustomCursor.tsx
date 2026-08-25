"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const pathname = usePathname();
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [cursorLabel, setCursorLabel] = useState("");
  const [isImageHover, setIsImageHover] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true); // assume touch until we know

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    // Detect if device has a fine pointer (mouse). Touch screens have "coarse" pointer.
    const isFinePinter = window.matchMedia("(pointer: fine)").matches;
    setIsTouchDevice(!isFinePinter);
  }, []);

  useEffect(() => {
    if (isTouchDevice || !cursorRef.current) return;

    // Use GSAP quickSetter for massive performance boost
    // Updates position directly bypassing React state and Framer Motion overhead
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.5, ease: "power3" });
    
    // Width and height setters
    const widthTo = gsap.quickTo(cursorRef.current, "width", { duration: 0.3, ease: "power3" });
    const heightTo = gsap.quickTo(cursorRef.current, "height", { duration: 0.3, ease: "power3" });

    let isHovered = false;
    let isImageOrDragHover = false;

    const updateMousePosition = (e: MouseEvent) => {
      // Calculate offset based on current state to keep cursor centered
      const offset = isImageOrDragHover ? 40 : isHovered ? 20 : 4;
      xTo(e.clientX - offset);
      yTo(e.clientY - offset);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const imageTarget = target.closest("[data-cursor='view']");
      if (imageTarget) {
        isImageOrDragHover = true;
        isHovered = false;
        setIsImageHover(true);
        setCursorLabel("View");
        widthTo(80);
        heightTo(80);
        return;
      }
      
      const dragTarget = target.closest("[data-cursor='drag']");
      if (dragTarget) {
        isImageOrDragHover = true;
        isHovered = false;
        setIsImageHover(true);
        setCursorLabel("Drag");
        widthTo(80);
        heightTo(80);
        return;
      }
      
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("hover-target")
      ) {
        isHovered = true;
        isImageOrDragHover = false;
        setIsImageHover(false);
        setCursorLabel("");
        widthTo(40);
        heightTo(40);
      } else {
        isHovered = false;
        isImageOrDragHover = false;
        setIsImageHover(false);
        setCursorLabel("");
        widthTo(8);
        heightTo(8);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    // Initial setup
    gsap.set(cursorRef.current, { width: 8, height: 8 });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isTouchDevice]);

  // Don't render the custom cursor on touch devices (mobile/tablet) or admin panel
  if (isTouchDevice || pathname.startsWith("/admin")) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[99999] bg-black/50 border border-black/5 flex items-center justify-center"
      style={{ willChange: "transform, width, height" }}
    >
      <span
        ref={textRef}
        className="text-[10px] font-medium tracking-[0.15em] uppercase transition-opacity duration-200"
        style={{ color: "#111111", opacity: isImageHover && cursorLabel ? 1 : 0 }}
      >
        {cursorLabel}
      </span>
    </div>
  );
}
