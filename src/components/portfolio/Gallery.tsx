"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

const defaultCategories = ["All", "Fashion", "Architecture", "Nature"];

interface GalleryProps {
  initialProjects?: any[];
}

export default function Gallery({ initialProjects = [] }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(() => {
    if (initialProjects.length > 0) {
      const uniqueCats = Array.from(new Set(initialProjects.map((p) => p.category))) as string[];
      return ["All", ...uniqueCats];
    }
    return defaultCategories;
  });
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 

  useEffect(() => {
    // If initialProjects were passed from SSR, use them. Otherwise fetch from client.
    if (initialProjects.length > 0) return;

    const fetchProjects = async () => {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();
      const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const mappedData = data.map(p => ({
          ...p,
          image: p.image_url,
          aspect: p.aspect_ratio || "aspect-[3/4]"
        }));
        setProjects(mappedData);
        const uniqueCats = Array.from(new Set(mappedData.map(p => p.category))) as string[];
        setDynamicCategories(["All", ...uniqueCats]);
      }
    };
    fetchProjects();
  }, [initialProjects]);
  
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full pb-32">
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 flex flex-wrap gap-6">
        {dynamicCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`text-sm uppercase tracking-widest hover-target pb-1 transition-all duration-300 ${
              activeCategory === cat ? "border-b border-muted text-muted" : "border-b border-transparent text-gray-500 hover:text-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 min-h-[50vh] transform-gpu">
          <AnimatePresence>
            {currentProjects.map((project, index) => (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                key={project.id}
                className="break-inside-avoid group cursor-pointer relative overflow-hidden block transform-gpu"
              >
                <Link href={`/portfolio/${project.id}`} className="block w-full h-full">
                  <div className={`relative w-full overflow-hidden ${project.aspect || "aspect-[3/4]"} bg-foreground/5 rounded-sm`}>
                    <Image
                      src={getOptimizedCloudinaryUrl(project.image || project.image_url)}
                      alt={project.title}
                      fill
                      priority={index < 3}
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                      className="object-cover scale-105 transition-transform duration-700 group-hover:scale-100"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={100}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <h3 className="text-xl md:text-2xl text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{project.title}</h3>
                      <p className="text-xs uppercase tracking-widest text-gray-300 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{project.category}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20 flex justify-center items-center gap-6">
          <button 
            onClick={() => {
              setCurrentPage(prev => Math.max(prev - 1, 1));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="px-8 py-3 border border-muted/20 disabled:opacity-30 disabled:cursor-not-allowed hover:border-muted transition-colors text-xs uppercase tracking-[0.2em]"
          >
            Previous
          </button>
          
          <span className="text-xs uppercase tracking-widest text-muted font-mono">
            {currentPage} / {totalPages}
          </span>
          
          <button 
            onClick={() => {
              setCurrentPage(prev => Math.min(prev + 1, totalPages));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="px-8 py-3 border border-muted/20 disabled:opacity-30 disabled:cursor-not-allowed hover:border-muted transition-colors text-xs uppercase tracking-[0.2em]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
