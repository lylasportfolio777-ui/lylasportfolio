"use client";

import { useState } from "react";
import { updateSiteConfigs } from "./actions";
import ImageUploadInput from "./ImageUploadInput";

export default function AdminHomeClient({ initialConfig }: { initialConfig: Record<string, string> }) {
  const [config, setConfig] = useState<Record<string, string>>(() => ({
    hero_title: "Lyla Steidl",
    hero_subtitle: "Portrait & Nature Photography.\nPut-in-Bay, Ohio.",
    hero_image: "",
    ...initialConfig
  }));
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setConfig({ ...config, [key]: value });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...config,
        site_name: config.hero_title ? config.hero_title.replace(/[\r\n]+/g, " ") : (config.site_name || "")
      };
      await updateSiteConfigs(payload);
      alert("All home settings saved successfully!");
    } catch (e: any) {
      alert("Failed to save: " + e.message);
    }
    setIsSaving(false);
  };

  const fields = [
    { key: "hero_title", label: "Hero Title", type: "text" },
    { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea" },
    { key: "hero_image", label: "Hero Main Image", type: "image" },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Homepage Hero settings</h2>
        <button
          disabled={isSaving}
          onClick={handleSaveAll}
          className="bg-foreground border-1 hover:bg-surface border-border text-background px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all duration-200 ease-in-out"
        >
          {isSaving ? "Saving..." : "Save All Settings"}
        </button>
      </div>

      <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-6">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium">{field.label}</label>
            <div className="flex gap-4">
              {field.type === "image" ? (
                <div className="flex-1">
                  <ImageUploadInput
                    value={config[field.key]}
                    onChange={(url) => handleChange(field.key, url)}
                    label="Upload Hero Image"
                  />
                </div>
              ) : field.type === "textarea" ? (
                <textarea
                  className="flex-1 min-h-[80px] border rounded-md p-3 text-sm bg-background"
                  value={config[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              ) : (
                <input
                  className="flex-1 h-10 border rounded-md px-3 text-sm bg-background"
                  value={config[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
