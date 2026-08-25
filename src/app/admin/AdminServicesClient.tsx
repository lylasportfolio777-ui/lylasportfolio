"use client";

import { useState } from "react";
import { deleteService, addService, updateService } from "./actions";
import ImageUploadInput from "./ImageUploadInput";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Briefcase, 
  Image as ImageIcon, 
  CheckCircle2, 
  Loader2, 
  X,
  Sparkles
} from "lucide-react";
import Image from "next/image";

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  image_url: string;
}

function getOptimizedUrl(url: string, width = 300) {
  if (!url || typeof url !== "string") return url;
  if (url.includes("cloudinary.com") && url.includes("/upload/")) {
    if (url.includes("/upload/f_auto,q_auto")) return url;
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
}

export default function AdminServicesClient({ initialServices }: { initialServices: ServiceItem[] }) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    image_url: "",
  });

  const resetForm = () => {
    setFormData({ name: "", category: "", image_url: "" });
    setIsAdding(false);
    setEditingService(null);
  };

  const handleStartEdit = (service: ServiceItem) => {
    setEditingService(service);
    setIsAdding(false);
    setFormData({
      name: service.name || "",
      category: service.category || "",
      image_url: service.image_url || "",
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteService(id);
      setServices(services.filter((s) => s.id !== id));
      setSuccessMessage(`Service "${name}" deleted.`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e: any) {
      alert("Failed to delete service: " + e.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert("Please upload a service preview image!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        image_url: formData.image_url,
      };

      if (editingService) {
        await updateService(editingService.id, payload);
        setServices(services.map((s) => (s.id === editingService.id ? { ...s, ...payload } : s)));
        setSuccessMessage(`Service "${formData.name}" updated!`);
      } else {
        const newId = await addService(payload);
        setServices([{ id: newId, ...payload }, ...services]);
        setSuccessMessage(`New service "${formData.name}" published!`);
      }

      resetForm();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (e: any) {
      alert("Error saving service: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      
      {/* Control Header */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-semibold text-foreground">Services Offered</h2>
            <span className="px-2.5 py-0.5 text-[11px] font-mono font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
              {services.length} Published
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage photography expertise offerings, category tags, and hover preview imagery displayed on the services showcase section.
          </p>
        </div>

        <button
          onClick={() => {
            if (isAdding || editingService) resetForm();
            else setIsAdding(true);
          }}
          className="px-4 py-2.5 bg-foreground text-background rounded-xl text-xs font-medium hover:opacity-90 transition-all flex items-center gap-2 shadow-sm shrink-0"
        >
          {isAdding || editingService ? (
            <>
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Service</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Drawer (Add / Edit Service) */}
      {(isAdding || editingService) && (
        <div className="bg-card border border-border p-6 md:p-8 rounded-2xl shadow-md space-y-6 relative transform-gpu">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-base font-semibold text-foreground">
                {editingService ? `Edit Service: ${editingService.name}` : "Create New Service Offering"}
              </h3>
            </div>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">Service Title</label>
                <input
                  required
                  type="text"
                  className="w-full h-10 border border-border rounded-xl px-3 text-xs bg-background text-foreground focus:outline-none focus:border-foreground/40"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Editorial Photography"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">Category Tag</label>
                <input
                  required
                  type="text"
                  className="w-full h-10 border border-border rounded-xl px-3 text-xs bg-background text-foreground focus:outline-none focus:border-foreground/40"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Fashion / Advertising / Lookbook"
                />
              </div>
            </div>

            {/* Service Preview Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Service Cover Image (Displayed on Hover)</span>
                <span className="text-[10px] text-muted-foreground font-mono">Cloudinary CDN Powered</span>
              </label>
              <ImageUploadInput
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                label="Upload Service Cover Image"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-border rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>

              <button
                disabled={isSubmitting}
                type="submit"
                className="px-6 py-2 bg-foreground text-background rounded-xl text-xs font-medium hover:opacity-90 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{editingService ? "Update Service" : "Publish Service"}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((svc, index) => (
          <div
            key={svc.id || index}
            className="bg-card border border-border rounded-2xl p-5 flex gap-4 items-center group hover:border-foreground/30 transition-all shadow-xs transform-gpu"
          >
            {/* Image Thumbnail */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-surface border border-border shrink-0">
              {svc.image_url ? (
                <Image
                  src={getOptimizedUrl(svc.image_url, 300)}
                  alt={svc.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="w-6 h-6 opacity-40" />
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                  #{String(index + 1).padStart(2, "0")}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider bg-surface text-foreground/80 rounded-md border border-border">
                  {svc.category || "General"}
                </span>
              </div>

              <h4 className="text-base font-semibold text-foreground truncate">{svc.name}</h4>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleStartEdit(svc)}
                className="p-2 border border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                title="Edit service"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleDelete(svc.id, svc.name)}
                className="p-2 border border-border rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                title="Delete service"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="col-span-full text-center py-16 px-4 border-2 border-dashed border-border rounded-2xl bg-card/50 flex flex-col items-center justify-center">
            <Briefcase className="w-8 h-8 text-muted-foreground mb-3 opacity-50" />
            <h3 className="text-base font-semibold text-foreground">No Services Published</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-6">
              Create your photography services to feature on the main services section.
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-foreground text-background rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Add First Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
