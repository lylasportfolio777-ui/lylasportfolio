import { 
  getSiteConfig, 
  getFeaturedProjects, 
  getServices, 
  getTestimonials 
} from "@/lib/getData";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

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
