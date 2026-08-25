import Footer from "@/components/layout/Footer";

export const metadata = { title: "Testimonials | AURA" };

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-20 flex-grow">
        <h1 className="text-6xl md:text-8xl font-light uppercase tracking-tighter mb-12">
          Client <span className="italic text-gray-400">Words</span>
        </h1>
        <div className="space-y-16 mt-16">
          <blockquote className="text-3xl font-light leading-snug">
            &quot;AURA captured the true essence of our architectural project. The play of light and shadow in their photography is unparalleled. They didn&apos;t just take photos; they told the story of our building.&quot;
            <footer className="mt-4 text-sm text-gray-400 uppercase tracking-widest">— Studio M Architects</footer>
          </blockquote>
          <blockquote className="text-3xl font-light leading-snug">
            &quot;An absolute masterclass in fashion photography. The cinematic quality they bring to every shoot elevated our entire campaign.&quot;
            <footer className="mt-4 text-sm text-gray-400 uppercase tracking-widest">— VOUGE Editorial Team</footer>
          </blockquote>
        </div>
      </div>
      <Footer />
    </main>
  );
}
