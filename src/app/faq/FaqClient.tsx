"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import Link from "next/link";

export default function FaqClient({ faqs }: { faqs: { question: string, answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-light text-dark pt-32 selection:bg-dark selection:text-light">
      <div className="max-w-4xl mx-auto px-6 md:px-12 mb-32">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ", href: "/faq" }]} />
        
        <div className="mt-12 mb-20 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray mb-8 block font-mono">
            Information
          </span>
          <h1 className="text-[clamp(3rem,6vw,5rem)] tracking-[-0.03em] leading-[1] mb-6 uppercase font-light">
            Frequently <br/> Asked <span className="italic text-gray">Questions.</span>
          </h1>
          <p className="text-lg text-dark/60 font-light max-w-lg mx-auto">
            Everything you need to know about our process, availability, and investment.
          </p>
        </div>

        <div className="border-t border-dark/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border-b border-dark/10">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-8 flex justify-between items-center text-left hover:text-gray transition-colors duration-300"
                >
                  <h3 className="text-xl md:text-2xl font-light tracking-tight pr-8">{faq.question}</h3>
                  <span className="text-2xl font-light transform transition-transform duration-500" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                    +
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 text-lg text-dark/70 font-light leading-relaxed pr-8 md:pr-20">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        
        <div className="mt-32 text-center">
          <p className="text-xl font-light mb-8">Still have questions?</p>
          <Link href="/book">
            <button className="px-10 py-5 bg-[#1C1D20] text-white rounded-full uppercase tracking-[0.15em] text-xs font-mono hover:scale-105 active:scale-95 transition-transform duration-300">
              Inquire Now
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
