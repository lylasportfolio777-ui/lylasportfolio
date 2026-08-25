import { createClient } from "@/utils/supabase/server";
import { constructMetadata } from "@/lib/seo/metadata";
import ProjectClient from "./ProjectClient";
import { notFound } from "next/navigation";

// Fallback data if no project is found or for static demo projects
const allProjects = [
  { id: 1, title: "Ethereal Shadows", category: "Fashion", image_url: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/man-on-a-street.jpg", description: "A high-fashion editorial focusing on the stark contrasts of urban light." },
  { id: 2, title: "Concrete Poetry", category: "Architecture", image_url: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/man-on-a-escalator.jpg", description: "Exploring brutalist shapes and structural elegance." },
  { id: 3, title: "Midnight Sun", category: "Nature", image_url: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/look-up.jpg", description: "A quiet reflection on isolation and the beauty of silence." },
];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  
  const title = project?.title || allProjects.find(p => p.id.toString() === id)?.title || "Project";
  
  return constructMetadata({
    title: `${title} | Case Study`,
    description: project?.description || "View this stunning photography case study.",
    image: project?.image_url || undefined,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  // Fetch real data from Supabase
  const supabase = await createClient();
  const { data: projectData } = await supabase.from("projects").select("*").eq("id", id).single();
  
  // Fallback to static mock data if not in DB
  const project = projectData || allProjects.find(p => p.id.toString() === id);

  if (!project) {
    notFound();
  }

  // Use uploaded gallery_urls from Supabase, or default to hero image + fallback samples
  const uploadedGallery = Array.isArray(project.gallery_urls) && project.gallery_urls.length > 0
    ? project.gallery_urls
    : [];

  const caseStudyImages = uploadedGallery.length > 0
    ? [project.image_url, ...uploadedGallery.filter((url: string) => url !== project.image_url)]
    : [
        project.image_url,
        "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547572/samples/people/bicycle.jpg",
        "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547577/samples/two-ladies.jpg",
        "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547581/samples/smile.jpg",
        "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/man-on-a-street.jpg"
      ];

  return <ProjectClient project={project} gallery={caseStudyImages} />;
}
