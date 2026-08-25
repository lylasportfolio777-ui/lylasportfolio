"use client";

import { useState } from "react";
import { updateSiteConfig, deleteCloudinaryAsset } from "./actions";
import ImageUploadInput from "./ImageUploadInput";
import { 
  Plus, 
  Save, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  CheckCircle2, 
  Image as ImageIcon, 
  Loader2,
  RefreshCw,
  CheckSquare,
  Square
} from "lucide-react";

interface BTSImage {
  src: string;
  caption: string;
}

const DEFAULT_BTS: BTSImage[] = [
  { src: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/man-on-a-street.jpg", caption: "On set — Nocturne campaign, Paris" },
  { src: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/man-on-a-escalator.jpg", caption: "Studio lighting test — Medium format" },
  { src: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/look-up.jpg", caption: "Location scouting — Alps, dawn" },
  { src: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547581/samples/smile.jpg", caption: "Backstage — Fashion week SS26" },
  { src: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547581/samples/balloons.jpg", caption: "Site preparation — Brutalism series" },
  { src: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547577/samples/two-ladies.jpg", caption: "Prop styling — Still life session" },
  { src: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547572/samples/people/bicycle.jpg", caption: "Directing talent — Editorial shoot" },
];

export default function AdminBTSClient({ initialConfig }: { initialConfig: Record<string, string> }) {
  const [images, setImages] = useState<BTSImage[]>(() => {
    if (initialConfig.behind_the_scenes_images) {
      try {
        return JSON.parse(initialConfig.behind_the_scenes_images);
      } catch (e) {
        console.error("Failed to parse BTS images config:", e);
      }
    }
    return DEFAULT_BTS;
  });

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIndices.length === images.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(images.map((_, i) => i));
    }
  };

  const toggleSelect = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIndices.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIndices.length} selected BTS image(s)? This will clean Cloudinary assets.`)) return;

    selectedIndices.forEach((idx) => {
      const img = images[idx];
      if (img?.src) {
        deleteCloudinaryAsset(img.src).catch(console.error);
      }
    });

    setImages(images.filter((_, i) => !selectedIndices.includes(i)));
    setSelectedIndices([]);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updated = [...images];
    updated[index].caption = caption;
    setImages(updated);
  };

  const handleImageChange = (index: number, src: string) => {
    const updated = [...images];
    updated[index].src = src;
    setImages(updated);
  };

  const handleAdd = () => {
    setImages([...images, { src: "", caption: "" }]);
  };

  const handleBatchAdd = (urls: string[]) => {
    const newItems = urls.map((url) => ({ src: url, caption: "" }));
    setImages([...images, ...newItems]);
  };

  const handleDelete = async (index: number) => {
    const target = images[index];
    if (target?.src) {
      deleteCloudinaryAsset(target.src).catch(console.error);
    }
    setImages(images.filter((_, i) => i !== index));
    setSelectedIndices(selectedIndices.filter((i) => i !== index));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === images.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImages(updated);
    setSelectedIndices([]);
  };

  const handleResetDefaults = () => {
    if (confirm("Reset gallery to default sample items? Unsaved changes will be lost.")) {
      setImages(DEFAULT_BTS);
      setSelectedIndices([]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateSiteConfig("behind_the_scenes_images", JSON.stringify(images));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (e: any) {
      alert("Failed to save: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      {/* Header & Controls */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">Behind the Scenes Showcase</h2>
            <span className="px-2.5 py-0.5 text-[11px] font-mono font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
              {images.length} Moments
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Curate photos and editorial captions displayed in the homepage infinite marquee showcase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {selectedIndices.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-3.5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIndices.length})</span>
            </button>
          )}

          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 border border-border hover:bg-surface rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            title="Reset to default items"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleAdd}
            className="px-3.5 py-2 border border-border hover:bg-surface rounded-xl text-xs font-medium text-foreground transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Moment</span>
          </button>

          <button
            disabled={isSaving}
            onClick={handleSave}
            className="px-5 py-2 bg-foreground text-background rounded-xl text-xs font-medium hover:opacity-90 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Showcase</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Behind the Scenes gallery updated successfully! Homepage marquee will update automatically.</span>
        </div>
      )}

      {/* Multi-Select Toolbar Strip */}
      {images.length > 0 && (
        <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 hover:text-foreground transition-colors font-medium"
          >
            {selectedIndices.length === images.length ? (
              <CheckSquare className="w-4 h-4 text-primary" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            <span>
              {selectedIndices.length === images.length ? "Deselect All" : "Select All"} ({images.length})
            </span>
          </button>

          {selectedIndices.length > 0 && (
            <span className="font-mono text-[11px] text-primary">
              {selectedIndices.length} item(s) selected
            </span>
          )}
        </div>
      )}

      {/* Images List */}
      <div className="space-y-4">
        {images.map((img, index) => {
          const isSelected = selectedIndices.includes(index);
          return (
            <div
              key={index}
              className={`bg-card border ${
                isSelected ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-foreground/20"
              } p-5 rounded-2xl flex flex-col md:flex-row gap-5 items-start relative group transition-all shadow-xs`}
            >
              {/* Checkbox & Reorder Controls */}
              <div className="flex md:flex-col items-center justify-between md:justify-start gap-3 shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => toggleSelect(index)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  title="Select for bulk delete"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-primary" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>

                <span className="w-8 h-8 rounded-lg bg-surface border border-border text-foreground/70 font-mono text-xs font-semibold flex items-center justify-center">
                  #{String(index + 1).padStart(2, "0")}
                </span>

              <div className="flex md:flex-col gap-1">
                <button
                  disabled={index === 0}
                  onClick={() => moveItem(index, "up")}
                  className="p-1.5 rounded-lg border border-border hover:bg-surface text-foreground/70 hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={index === images.length - 1}
                  onClick={() => moveItem(index, "down")}
                  className="p-1.5 rounded-lg border border-border hover:bg-surface text-foreground/70 hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main Form Fields Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
              {/* Photo Asset Upload */}
              <div className="md:col-span-6 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  Photo Asset
                </label>
                <ImageUploadInput
                  value={img.src}
                  onChange={(url) => handleImageChange(index, url)}
                  label="Upload BTS Photo"
                />
              </div>

              {/* Marquee Caption Textarea */}
              <div className="md:col-span-6 space-y-1.5 flex flex-col">
                <label className="text-xs font-medium text-muted-foreground block">
                  Marquee Caption
                </label>
                <textarea
                  rows={3}
                  className="w-full flex-1 border border-border rounded-xl p-3 text-xs bg-background text-foreground focus:outline-none focus:border-foreground/40 transition-colors resize-none leading-relaxed"
                  value={img.caption}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  placeholder="e.g. On set — Paris Campaign"
                />
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(index)}
              className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-colors self-start shrink-0"
              title="Remove photo & clean Cloudinary memory"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}

        {images.length === 0 && (
          <div className="text-center py-16 px-4 border-2 border-dashed border-border rounded-2xl bg-card/50 flex flex-col items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground mb-3 opacity-50" />
            <h3 className="text-base font-semibold text-foreground">No Behind the Scenes Photos</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-6">
              Add photos and captions to create an engaging behind the scenes marquee on your site.
            </p>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-foreground text-background rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Add First BTS Moment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
