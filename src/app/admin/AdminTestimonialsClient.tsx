"use client";

import { useState } from "react";
import { deleteTestimonial, addTestimonial } from "./actions";
import ImageUploadInput from "./ImageUploadInput";

function getOptimizedUrl(url: string, width = 200) {
  if (!url || typeof url !== "string") return url;
  if (url.includes("cloudinary.com") && url.includes("/upload/")) {
    if (url.includes("/upload/f_auto,q_auto")) return url;
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
}

export default function AdminTestimonialsClient({ initialTestimonials }: { initialTestimonials: any[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [isAdding, setIsAdding] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ quote: "", author: "", role: "", company: "", image_url: "" });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      setTestimonials(testimonials.filter((p) => p.id !== id));
    } catch (e: any) {
      alert("Failed to delete: " + e.message);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.image_url) return alert("Please upload an image first!");
    try {
      await addTestimonial(newTestimonial);
      alert("Testimonial added!");
      window.location.reload();
    } catch (e: any) {
      alert("Failed to add testimonial: " + e.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Testimonials</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
          {isAdding ? "Cancel" : "Add Testimonial"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm transform-gpu">
          <form onSubmit={handleAddSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="text-sm font-medium mb-1 block">Quote</label>
              <textarea required className="w-full h-24 border rounded-md p-3 text-sm bg-background" value={newTestimonial.quote} onChange={(e) => setNewTestimonial({...newTestimonial, quote: e.target.value})} placeholder="They were amazing to work with..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Author</label>
                <input required className="w-full h-10 border rounded-md px-3 text-sm bg-background" value={newTestimonial.author} onChange={(e) => setNewTestimonial({...newTestimonial, author: e.target.value})} placeholder="Isabelle Laurent" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Role</label>
                <input required className="w-full h-10 border rounded-md px-3 text-sm bg-background" value={newTestimonial.role} onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})} placeholder="Creative Director" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Company</label>
              <input required className="w-full h-10 border rounded-md px-3 text-sm bg-background" value={newTestimonial.company} onChange={(e) => setNewTestimonial({...newTestimonial, company: e.target.value})} placeholder="CHANEL" />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Project Image Upload</label>
              <ImageUploadInput
                value={newTestimonial.image_url}
                onChange={(url) => setNewTestimonial({ ...newTestimonial, image_url: url })}
                label="Upload Testimonial Image"
              />
            </div>
            <button type="submit" className="w-full bg-foreground text-background py-2 rounded-md text-sm font-medium mt-4 hover:opacity-90 transition-opacity">Save Testimonial</button>
          </form>
        </div>
      )}

      <div className="border border-border rounded-xl overflow-hidden bg-card transform-gpu">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Author</th>
              <th className="px-6 py-4 font-medium">Company</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {testimonials.map((test) => (
              <tr key={test.id} className="hover:bg-surface/50 transition-colors">
                <td className="px-6 py-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={getOptimizedUrl(test.image_url, 200)} 
                    alt={test.author || "Testimonial"} 
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 object-cover rounded-md bg-muted" 
                  />
                </td>
                <td className="px-6 py-4 font-medium">{test.author} <span className="text-muted-foreground">({test.role})</span></td>
                <td className="px-6 py-4">{test.company}</td>
                <td className="px-6 py-4 text-right"><button onClick={() => handleDelete(test.id)} className="text-red-500 font-medium hover:underline">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
