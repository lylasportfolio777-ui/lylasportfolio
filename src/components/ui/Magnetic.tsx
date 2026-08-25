"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Magnetic({
  children,
  strength = 20,
  className = "",
  onClick,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    // Direct GSAP quickTo setters for 60fps hardware accelerated magnetic effect without React state re-renders
    const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    let bounds: DOMRect | null = null;

    const handleMouseEnter = () => {
      bounds = el.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!bounds) bounds = el.getBoundingClientRect();
      const { clientX, clientY } = e;
      const { height, width, left, top } = bounds;
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      const factor = strength / 100;
      xTo(middleX * factor);
      yTo(middleY * factor);
    };

    const handleMouseLeave = () => {
      bounds = null;
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      xTo(0);
      yTo(0);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
