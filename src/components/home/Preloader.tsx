"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import SplitType from "split-type";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

const DEFAULT_IMAGES = [
  "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/man-on-a-street.jpg",
  "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/man-on-a-escalator.jpg",
  "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/look-up.jpg",
  "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547581/samples/smile.jpg",
  "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547581/samples/balloons.jpg",
  "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547577/samples/two-ladies.jpg",
];

interface PreloaderProps {
  onComplete: () => void;
  config: Record<string, string>;
}

export default function Preloader({ onComplete, config }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);

  const images = [
    config["preloader_image_1"] || DEFAULT_IMAGES[0],
    config["preloader_image_2"] || DEFAULT_IMAGES[1],
    config["preloader_image_3"] || DEFAULT_IMAGES[2],
    config["preloader_image_4"] || DEFAULT_IMAGES[3],
    config["preloader_image_5"] || DEFAULT_IMAGES[4],
    config["preloader_image_6"] || DEFAULT_IMAGES[5],
  ];

  const preloaderText = config["preloader_text"] || "Lyla Steidl";

  useEffect(() => {
    let titleSplit: SplitType | null = null;

    const ctx = gsap.context(() => {
      titleSplit = new SplitType(".title", { types: "words,chars" });
      const counter = counterRef.current;

      gsap.set(".card", {
        opacity: 1,
        xPercent: -50,
        yPercent: -50,
        scale: 0,
        rotate: (i) => [8, -3, -10, 10, -7, 5][i],
      });

      gsap.set(titleSplit.chars, {
        yPercent: 100,
        rotation: 10,
        transformOrigin: "0% 100%",
      });

      gsap.set(".count p", { yPercent: 100 });

      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(".card", {
        scale: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
        ease: "power3.inOut",
        stagger: 0.2,
      });

      tl.set(".brand", { visibility: "visible" }, 0.35);

      tl.to(
        titleSplit.chars,
        {
          yPercent: 0,
          rotation: 0,
          duration: 1,
          ease: "power3.out",
          stagger: { amount: 0.24 },
        },
        0.35
      );

      tl.to(".count p", { yPercent: 0, duration: 1, ease: "power3.out" }, "<");

      tl.to(
        { value: 0 },
        {
          value: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate() {
            if (counter) {
              counter.textContent = String(Math.round(this.targets()[0].value)).padStart(3, "0");
            }
          },
        },
        "<0.5"
      );

      tl.to(
        titleSplit.chars,
        {
          yPercent: -105,
          rotation: -10,
          duration: 0.75,
          ease: "power3.in",
          stagger: { amount: 0.24 },
        },
        3.25
      );

      tl.to(".count p", { yPercent: -100, duration: 0.75, ease: "power3.in" }, 3.25);

      tl.to(
        ".card",
        {
          scale: 0,
          clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
          duration: 1,
          ease: "power3.inOut",
          stagger: -0.075,
        },
        3.5
      );

      tl.to(
        rootRef.current,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "power3.inOut",
          onComplete: () => {
            if (onComplete) onComplete();
          },
        },
        4.35
      );
    }, rootRef);

    return () => {
      ctx.revert();
      if (titleSplit) titleSplit.revert();
    };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      className="loader fixed inset-0 bg-[#FAFAF7] text-[#111111] overflow-hidden z-[9999] uppercase leading-[0.85]"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        fontFamily: "inherit",
      }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className="card absolute top-1/2 left-1/2 w-[45vw] max-w-[250px] aspect-[5/6] will-change-transform opacity-0"
          style={{ clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getOptimizedCloudinaryUrl(src, 400)}
            alt=""
            className="w-full h-full object-cover scale-[1.02]"
            fetchPriority={i < 2 ? "high" : "auto"}
            decoding="async"
          />
        </div>
      ))}

      <div className="brand absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible whitespace-nowrap will-change-transform overflow-hidden">
        <div className="title m-0 font-normal text-[clamp(2.5rem,8vw,9rem)] tracking-tighter">
          {preloaderText}
        </div>
        <div className="count absolute -top-6 right-0 md:-top-4 md:right-auto md:left-[calc(100%+0.5rem)] overflow-hidden text-[clamp(1rem,1.5vw,1.5rem)]">
          <p ref={counterRef} className="m-0 leading-none">000</p>
        </div>
      </div>
    </div>
  );
}
