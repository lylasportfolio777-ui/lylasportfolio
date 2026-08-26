import Gallery from "@/components/portfolio/Gallery";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portfolio | AURA",
  description: "View our curated collection of fine art photography.",
};

export default async function PortfolioPage() {
  const supabase = await createClient();
  const { data: rawProjects } = await supabase
    .from("projects")
    .select("id, title, category, image_url, created_at")
    .order("created_at", { ascending: false });

  const initialProjects = (rawProjects || []).map((p) => ({
    ...p,
    image: p.image_url,
    aspect: p.aspect_ratio || "aspect-[3/4]",
  }));

  return (
    <main className="min-h-screen bg-background pt-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20 text-center flex flex-col items-center">
        <span className="section-label block mb-6">The Archive</span>
        <h1 className="text-[clamp(3rem,10vw,7rem)] tracking-[-0.03em] mb-6 leading-[1.1]">
          Selected <span className="text-muted">Works.</span>
        </h1>
        <p className="max-w-xl text-lg font-light leading-relaxed text-foreground/70">
          A comprehensive collection of our most evocative work, exploring the intersection of light, architecture, and human emotion.
        </p>
      </div>
      
      <Gallery initialProjects={initialProjects} />
      <Footer />
    </main>
  );
}
