"use client";

import { useState } from "react";
import { deleteProject, addProject, deleteCloudinaryAsset } from "./actions";
import ImageUploadInput from "./ImageUploadInput";
import { X, ExternalLink, Trash2, FolderPlus, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  image_url: string;
  description?: string;
  gallery_urls?: string[];
  created_at: string;
};

// Cloudinary image URL optimizer helper to reduce 10MB camera uploads to ~30KB thumbnails
function getOptimizedUrl(url: string, width = 600) {
  if (!url || typeof url !== "string") return url;
  if (url.includes("cloudinary.com") && url.includes("/upload/")) {
    if (url.includes("/upload/f_auto,q_auto")) return url;
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
}

export default function AdminProjectsClient({ 
  initialProjects, 
  initialCategories 
}: { 
  initialProjects: Project[]; 
  initialCategories: any[]; 
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({ 
    title: "", 
    category: initialCategories.length > 0 ? initialCategories[0].name : "", 
    year: "", 
    image_url: "",
    description: "",
    gallery_urls: [] as string[]
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (e: any) {
      alert("Failed to delete: " + e.message);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.image_url) {
      alert("Please upload a cover image first!");
      return;
    }
    try {
      const createdProject = await addProject(newProject);
      setProjects([createdProject, ...projects]);
      setNewProject({ 
        title: "", 
        category: initialCategories.length > 0 ? initialCategories[0].name : "", 
        year: "", 
        image_url: "",
        description: "",
        gallery_urls: []
      });
      setIsAdding(false);
    } catch (e: any) {
      alert("Failed to add project: " + e.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Projects (Case Studies)</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {isAdding ? "Cancel" : "Add New Case Study"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm transform-gpu">
          <h3 className="text-lg font-medium mb-4">New Case Study Details</h3>
          <form onSubmit={handleAddSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <input required className="w-full h-10 border rounded-md px-3 text-sm bg-background" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} placeholder="e.g. Nocturne" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <select 
                  required 
                  className="w-full h-10 border rounded-md px-3 text-sm bg-background" 
                  value={newProject.category} 
                  onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                >
                  {initialCategories.length === 0 ? (
                    <option value="" disabled>Please create a category first</option>
                  ) : (
                    initialCategories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Year</label>
                <input required className="w-full h-10 border rounded-md px-3 text-sm bg-background" value={newProject.year} onChange={(e) => setNewProject({...newProject, year: e.target.value})} placeholder="e.g. 2026" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Editorial Description</label>
              <textarea 
                required
                className="w-full h-24 border rounded-md p-3 text-sm bg-background" 
                value={newProject.description} 
                onChange={(e) => setNewProject({...newProject, description: e.target.value})} 
                placeholder="Write the story behind the shoot..." 
              />
            </div>
            
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Cover Image</label>
                <ImageUploadInput
                  value={newProject.image_url}
                  onChange={(url) => setNewProject({ ...newProject, image_url: url })}
                  label="Upload Cover Image"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Case Study Gallery Images ({newProject.gallery_urls.length} uploaded)
                </label>
                <ImageUploadInput
                  multiple
                  onChange={() => {}}
                  onMultipleChange={(urls) =>
                    setNewProject((prev) => ({
                      ...prev,
                      gallery_urls: [...prev.gallery_urls, ...urls],
                    }))
                  }
                  label="Click to add multiple gallery photos"
                />
                
                {/* Thumbnails of uploaded gallery images */}
                {newProject.gallery_urls.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {newProject.gallery_urls.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border group bg-muted transform-gpu">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={getOptimizedUrl(url, 200)} 
                          alt={`Gallery ${idx + 1}`} 
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover" 
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteCloudinaryAsset(url);
                            setNewProject((prev) => ({
                              ...prev,
                              gallery_urls: prev.gallery_urls.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs shadow-md hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="w-full h-10 bg-foreground text-background rounded-md font-medium hover:opacity-90 mt-4 transition-opacity">
              Save Case Study
            </button>
          </form>
        </div>
      )}

      {/* Grid of existing projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-card border border-border/80 hover:border-foreground/20 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group transform-gpu"
          >
            {/* Image Header with Overlay Badges */}
            <div className="aspect-[16/10] relative bg-muted overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={getOptimizedUrl(project.image_url, 600)} 
                alt={project.title} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              
              {/* Top Badges */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                <span className="px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider bg-black/60 text-white backdrop-blur-md rounded-full border border-white/10 uppercase">
                  {project.category}
                </span>
                {project.year && (
                  <span className="px-2.5 py-1 text-[10px] font-mono font-medium bg-black/60 text-white/90 backdrop-blur-md rounded-full border border-white/10">
                    {project.year}
                  </span>
                )}
              </div>

              {/* Bottom Image Info */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                <span className="text-[11px] font-mono text-white/80 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm" suppressHydrationWarning>
                  {project.created_at ? new Date(project.created_at).toISOString().split("T")[0] : "Recently Added"}
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
              <div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>

              {/* Gallery Photos Preview Strip */}
              {Array.isArray(project.gallery_urls) && project.gallery_urls.length > 0 && (
                <div className="pt-3 border-t border-border/60">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-medium text-foreground/70 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-foreground/50" />
                      <span>Case Study Gallery ({project.gallery_urls.length})</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {project.gallery_urls.slice(0, 4).map((gUrl, gIdx) => (
                      <div key={gIdx} className="aspect-square rounded-lg border border-border overflow-hidden bg-muted relative group/thumb transform-gpu">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={getOptimizedUrl(gUrl, 200)} 
                          alt={`Gallery ${gIdx + 1}`} 
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                <Link
                  href={`/portfolio/${project.id}`}
                  target="_blank"
                  className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg bg-background hover:bg-surface transition-colors flex items-center gap-1.5 text-foreground/80 hover:text-foreground shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Live</span>
                </Link>

                <button 
                  onClick={() => handleDelete(project.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors flex items-center gap-1.5"
                  title="Delete case study & clean Cloudinary assets"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && !isAdding && (
        <div className="text-center py-16 px-4 border-2 border-dashed border-border rounded-2xl bg-card/50 flex flex-col items-center justify-center">
          <div className="p-4 rounded-full bg-surface border border-border mb-4">
            <FolderPlus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No Case Studies Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-6">
            Upload and organize your photography case studies to showcase on your portfolio.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-foreground text-background rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Create Your First Case Study
          </button>
        </div>
      )}
    </div>
  );
}
