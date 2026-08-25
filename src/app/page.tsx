import { 
  getSiteConfig, 
  getFeaturedProjects, 
  getServices, 
  getTestimonials 
} from "@/lib/getData";
import HomeClient from "./HomeClient";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export default async function Home() {
  const [config, featuredProjects, services, testimonials] = await Promise.all([
    getSiteConfig(),
    getFeaturedProjects(),
    getServices(),
    getTestimonials(),
  ]);

  return (
    <HomeClient 
      config={config} 
      initialProjects={featuredProjects}
      initialServices={services}
      initialTestimonials={testimonials}
    />
  );
}
