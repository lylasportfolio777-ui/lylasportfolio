"use client";

import { useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

const DEFAULT_BTS = [
  { src: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/man-on-a-street.jpg", caption: "On set — Nocturne campaign, Paris" },
  { src: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/man-on-a-escalator.jpg", caption: "Studio lighting test — Medium format" },
  { src: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/look-up.jpg", caption: "Location scouting — Alps, dawn" },
  { src: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547581/samples/smile.jpg", caption: "Backstage — Fashion week SS26" },
  { src: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547581/samples/balloons.jpg", caption: "Site preparation — Brutalism series" },
  { src: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547577/samples/two-ladies.jpg", caption: "Prop styling — Still life session" },
  { src: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547572/samples/people/bicycle.jpg", caption: "Directing talent — Editorial shoot" },
];

interface BehindTheScenesProps {
  config: Record<string, string>;
}

export default function BehindTheScenes({ config }: BehindTheScenesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const images = useMemo(() => {
    if (config.behind_the_scenes_images) {
      try {
        const parsed = JSON.parse(config.behind_the_scenes_images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* use defaults */ }
    }
    return DEFAULT_BTS;
  }, [config]);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    const ctx = gsap.context(() => {
      if (!scrollRef.current || !sectionRef.current) return;

      const slides = gsap.utils.toArray<HTMLElement>('.bts-slide');
      
      if (!slides.length) return;

      const totalScroll = window.innerWidth * (slides.length - 1);

      const mainTween = gsap.to(scrollRef.current, {
        x: () => -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${totalScroll}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          snap: {
            snapTo: 1 / (slides.length - 1),
            duration: { min: 0.2, max: 0.5 },
            delay: 0.05,
            ease: "power1.inOut"
          }
        },
      });

      const imgs = scrollRef.current.querySelectorAll(".bts-image");
      imgs.forEach((img) => {
        gsap.fromTo(img,
          { clipPath: "inset(15% 15% 15% 15%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: img,
              containerAnimation: mainTween,
              start: "left 90%",
              end: "left 30%",
              scrub: 1.5,
            },
          }
        );
      });
    }, sectionRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [config?.behind_the_scenes_images, images.length]);

  return (
    <div ref={sectionRef} className="relative h-screen overflow-hidden" style={{ backgroundColor: "#064420" }}>
      <div className="absolute top-8 left-6 md:left-12 z-10 mix-blend-difference">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/80">Behind the Scenes</span>
      </div>

      <div
        ref={scrollRef}
        className="flex h-full w-max"
        data-cursor="drag"
      >
        <div className="bts-slide flex-shrink-0 w-screen h-screen flex flex-col justify-center items-center px-6 md:px-24">
          <h2 className="text-[12vw] md:text-[6rem] tracking-tight text-white mb-6 text-center leading-none font-medium">
            Behind<br/>
            <span className="text-white/50 italic font-light">the lens.</span>
          </h2>
          <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-md text-center font-serif italic">
            Every image has a story behind it. From dawn location scouts to late-night post-production sessions, this is where the craft lives.
          </p>
        </div>

        {images.map((img, i) => (
          <div key={i} className="bts-slide flex-shrink-0 w-screen h-screen flex flex-col justify-center items-center px-4 md:px-12">
            <div className="bts-image relative overflow-hidden w-full max-w-[1400px] h-[65vh] md:h-[80vh]">
              <Image
                src={getOptimizedCloudinaryUrl(img.src || DEFAULT_BTS[0].src, 1200)}
                alt={img.caption || "Behind the scenes photo"}
                fill
                className="object-cover"
                sizes="(max-width: 1400px) 100vw, 1400px"
                loading="lazy"
                quality={85}
                onLoad={() => ScrollTrigger.refresh()}
              />
            </div>
            <div className="w-full max-w-[1400px] mt-6 flex justify-between items-center text-white">
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-white/60">{img.caption}</span>
              <span className="text-xs font-mono tracking-widest text-white/40">{(i + 1).toString().padStart(2, '0')} / {images.length.toString().padStart(2, '0')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
