"use client";

import { useState } from "react";
import { updateSiteConfigs } from "./actions";
import ImageUploadInput from "./ImageUploadInput";

export default function AdminAboutClient({ initialConfig }: { initialConfig: Record<string, string> }) {
  const [config, setConfig] = useState<Record<string, string>>(() => ({
    about_heading: "A quiet obsession\nwith light\nand form.",
    about_text_p1: "I believe photography exists at the intersection of patience and instinct. Every frame I create begins with observation — studying how light shapes a space, how shadow carves depth, how a single moment can contain an entire story.",
    about_text_p2: "With over a decade behind the lens, my work spans editorial fashion, architectural documentation, and fine art photography. I shoot exclusively on medium format, preserving every nuance of tone and texture.",
    about_craft_heading: "The Craft & Process",
    about_craft_p1: "Every project is approached as a bespoke artistic commission. We do not rely on standard templates or digital shortcuts. From pre-production mood boards and location scouting to custom lighting direction on set, every element is curated to evoke raw, timeless emotion.",
    about_craft_p2: "Utilizing high-resolution medium format systems alongside specialized vintage glass, we ensure maximum chromatic fidelity and dynamic range — crafting heirlooms meant to be appreciated across generations.",
    about_marquee_text: "Vogue • Harper's Bazaar • GQ • Vanity Fair",
    about_image: "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547569/samples/people/smiling-man.jpg",
    about_caption_left: "Self portrait, Paris 2025",
    about_caption_right: "Hasselblad X2D",
    about_stat_1_val: "12+",
    about_stat_1_lbl: "Years Experience",
    about_stat_2_val: "200+",
    about_stat_2_lbl: "Projects",
    about_stat_3_val: "15",
    about_stat_3_lbl: "Awards",
    ...initialConfig
  }));
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await updateSiteConfigs(config);
      alert("All about settings saved successfully!");
    } catch (e: any) {
      alert("Failed to save: " + e.message);
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">About Us Settings</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage content, paragraphs, marquee banner, and portrait image for Homepage & /about page.</p>
        </div>
        <button
          disabled={isSaving}
          onClick={handleSaveAll}
          className="bg-foreground border border-gray text-background  px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all shrink-0"
        >
          {isSaving ? "Saving..." : "Save All Settings"}
        </button>
      </div>

      {/* Section 1: Hero & Vision Paragraphs */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-6">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-3">1. Main Heading & Vision Paragraphs</h3>
        
        {/* Heading */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Main Heading Text</label>
            <button type="button" onClick={() => handleChange("about_heading", "")} className="text-xs text-red-500 hover:underline">Clear Text</button>
          </div>
          <textarea
            rows={3}
            className="w-full border rounded-lg p-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none"
            value={config.about_heading || ""}
            onChange={(e) => handleChange("about_heading", e.target.value)}
          />
        </div>

        {/* Paragraph 1 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <label className="text-sm font-medium">Homepage Paragraph (Short Teaser)</label>
              <p className="text-xs text-muted-foreground">Displayed on Homepage About section and /about page.</p>
            </div>
            <button type="button" onClick={() => handleChange("about_text_p1", "")} className="text-xs text-red-500 hover:underline">Clear Text</button>
          </div>
          <textarea
            rows={4}
            className="w-full border rounded-lg p-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none"
            value={config.about_text_p1 || ""}
            onChange={(e) => handleChange("about_text_p1", e.target.value)}
          />
        </div>

        {/* Paragraph 2 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <label className="text-sm font-medium">About Page Paragraph 2 (Vision)</label>
              <p className="text-xs text-muted-foreground">Secondary paragraph displayed under Vision & Philosophy on /about page.</p>
            </div>
            <button type="button" onClick={() => handleChange("about_text_p2", "")} className="text-xs text-red-500 hover:underline">Clear Text</button>
          </div>
          <textarea
            rows={4}
            className="w-full border rounded-lg p-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none"
            value={config.about_text_p2 || ""}
            onChange={(e) => handleChange("about_text_p2", e.target.value)}
          />
        </div>
      </div>

      {/* Section 2: Craft & Process */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-6">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-3">2. Craft & Process Section</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Craft & Process Heading</label>
            <button type="button" onClick={() => handleChange("about_craft_heading", "")} className="text-xs text-red-500 hover:underline">Clear Text</button>
          </div>
          <input
            type="text"
            className="w-full h-10 border rounded-lg px-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none"
            value={config.about_craft_heading || ""}
            onChange={(e) => handleChange("about_craft_heading", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Craft Paragraph 1</label>
            <button type="button" onClick={() => handleChange("about_craft_p1", "")} className="text-xs text-red-500 hover:underline">Clear Text</button>
          </div>
          <textarea
            rows={3}
            className="w-full border rounded-lg p-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none"
            value={config.about_craft_p1 || ""}
            onChange={(e) => handleChange("about_craft_p1", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Craft Paragraph 2</label>
            <button type="button" onClick={() => handleChange("about_craft_p2", "")} className="text-xs text-red-500 hover:underline">Clear Text</button>
          </div>
          <textarea
            rows={3}
            className="w-full border rounded-lg p-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none"
            value={config.about_craft_p2 || ""}
            onChange={(e) => handleChange("about_craft_p2", e.target.value)}
          />
        </div>
      </div>

      {/* Section 3: Marquee Banner */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-3">3. Marquee Banner Clients / Publications</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <label className="text-sm font-medium">Marquee Items (Separated by • bullet dot)</label>
              <p className="text-xs text-muted-foreground">Example: Vogue • Harper's Bazaar • GQ • Vanity Fair</p>
            </div>
            <button type="button" onClick={() => handleChange("about_marquee_text", "")} className="text-xs text-red-500 hover:underline">Clear Text</button>
          </div>
          <input
            type="text"
            className="w-full h-10 border rounded-lg px-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none font-mono"
            value={config.about_marquee_text || ""}
            onChange={(e) => handleChange("about_marquee_text", e.target.value)}
          />
        </div>
      </div>

      {/* Section 4: Portrait Image & Captions */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-6">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-3">4. Portrait Image & Captions</h3>
        
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium block">About Portrait Image</label>
          <div className="w-full overflow-hidden">
            <ImageUploadInput
              value={config.about_image || ""}
              onChange={(url) => handleChange("about_image", url)}
              label="Upload Portrait Image"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Image Caption (Left)</label>
            <input
              type="text"
              className="w-full h-10 border rounded-lg px-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none"
              value={config.about_caption_left || ""}
              onChange={(e) => handleChange("about_caption_left", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Image Caption (Right)</label>
            <input
              type="text"
              className="w-full h-10 border rounded-lg px-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none"
              value={config.about_caption_right || ""}
              onChange={(e) => handleChange("about_caption_right", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Section 5: Key Statistics */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-6">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-3">5. Key Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat 1 */}
          <div className="space-y-3 p-4 border border-border/60 rounded-lg bg-background/50">
            <span className="text-xs font-semibold text-foreground uppercase">Stat 1</span>
            <input
              type="text"
              placeholder="Value (e.g. 12+)"
              className="w-full h-9 border rounded-md px-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none font-mono"
              value={config.about_stat_1_val || ""}
              onChange={(e) => handleChange("about_stat_1_val", e.target.value)}
            />
            <input
              type="text"
              placeholder="Label (e.g. Years Experience)"
              className="w-full h-9 border rounded-md px-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none"
              value={config.about_stat_1_lbl || ""}
              onChange={(e) => handleChange("about_stat_1_lbl", e.target.value)}
            />
          </div>

          {/* Stat 2 */}
          <div className="space-y-3 p-4 border border-border/60 rounded-lg bg-background/50">
            <span className="text-xs font-semibold text-foreground uppercase">Stat 2</span>
            <input
              type="text"
              placeholder="Value (e.g. 200+)"
              className="w-full h-9 border rounded-md px-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none font-mono"
              value={config.about_stat_2_val || ""}
              onChange={(e) => handleChange("about_stat_2_val", e.target.value)}
            />
            <input
              type="text"
              placeholder="Label (e.g. Projects Delivered)"
              className="w-full h-9 border rounded-md px-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none"
              value={config.about_stat_2_lbl || ""}
              onChange={(e) => handleChange("about_stat_2_lbl", e.target.value)}
            />
          </div>

          {/* Stat 3 */}
          <div className="space-y-3 p-4 border border-border/60 rounded-lg bg-background/50">
            <span className="text-xs font-semibold text-foreground uppercase">Stat 3</span>
            <input
              type="text"
              placeholder="Value (e.g. 15)"
              className="w-full h-9 border rounded-md px-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none font-mono"
              value={config.about_stat_3_val || ""}
              onChange={(e) => handleChange("about_stat_3_val", e.target.value)}
            />
            <input
              type="text"
              placeholder="Label (e.g. Awards Won)"
              className="w-full h-9 border rounded-md px-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-foreground outline-none"
              value={config.about_stat_3_lbl || ""}
              onChange={(e) => handleChange("about_stat_3_lbl", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
