import { 
  getSiteConfig, 
  getFeaturedProjects, 
  getServices, 
  getTestimonials 
} from "@/lib/getData";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch sequentially instead of Promise.all to prevent Next.js cookies() async context bugs
  const config = await getSiteConfig();
  const featuredProjects = await getFeaturedProjects();
  const services = await getServices();
  const testimonials = await getTestimonials();

  return (
    <HomeClient 
      config={config} 
      initialProjects={featuredProjects}
      initialServices={services}
      initialTestimonials={testimonials}
    />
  );
}
