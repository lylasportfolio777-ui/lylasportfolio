"use client";

import { useState } from "react";
import { updateSiteConfigs } from "./actions";
import ImageUploadInput from "./ImageUploadInput";

export default function AdminConfigClient({ initialConfig }: { initialConfig: Record<string, string> }) {
  const [config, setConfig] = useState<Record<string, string>>(() => ({
    contact_email: "studio@emiledurand.com",
    contact_phone: "+33 1 45 67 89 01",
    contact_description: "Available for editorial commissions, commercial campaigns, and fine art collaborations. Based in Paris, working worldwide.",
    contact_studio: "24 Rue de Rivoli\n75001 Paris, France",
    social_instagram: "#",
    social_behance: "#",
    social_vimeo: "#",
    social_linkedin: "#",
    ...initialConfig
  }));
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setConfig({ ...config, [key]: value });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await updateSiteConfigs(config);
      alert("All settings saved successfully!");
    } catch (e: any) {
      alert("Failed to save: " + e.message);
    }
    setIsSaving(false);
  };

  const fields = [
    { key: "contact_email", label: "Contact Email", type: "text" },
    { key: "contact_phone", label: "Contact Phone", type: "text" },
    { key: "contact_description", label: "Contact Description", type: "textarea" },
    { key: "contact_studio", label: "Studio Address", type: "textarea" },
    { key: "social_instagram", label: "Instagram URL", type: "text" },
    { key: "social_behance", label: "Behance URL", type: "text" },
    { key: "social_vimeo", label: "Vimeo URL", type: "text" },
    { key: "social_linkedin", label: "LinkedIn URL", type: "text" },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">General Settings</h2>
        <button
          disabled={isSaving}
          onClick={handleSaveAll}
          className="bg-foreground text-background px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
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
                    label="Upload Image"
                  />
                </div>
              ) : field.type === "textarea" ? (
                <textarea
                  className="flex-1 min-h-[120px] border rounded-md p-3 text-sm bg-background"
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
