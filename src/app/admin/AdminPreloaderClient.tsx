"use client";

import { useState } from "react";
import { updateSiteConfigs } from "./actions";
import ImageUploadInput from "./ImageUploadInput";

const DEFAULT_IMAGES = [
  "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/man-on-a-street.jpg",
  "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/man-on-a-escalator.jpg",
  "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547582/samples/look-up.jpg",
  "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547581/samples/smile.jpg",
  "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547581/samples/balloons.jpg",
  "https://res.cloudinary.com/duk94ehtq/image/upload/v1761547577/samples/two-ladies.jpg",
];

export default function AdminPreloaderClient({ initialConfig }: { initialConfig: Record<string, string> }) {
  const [config, setConfig] = useState<Record<string, string>>(() => ({
    preloader_text: "Emily Ratajkowski",
    preloader_image_1: DEFAULT_IMAGES[0],
    preloader_image_2: DEFAULT_IMAGES[1],
    preloader_image_3: DEFAULT_IMAGES[2],
    preloader_image_4: DEFAULT_IMAGES[3],
    preloader_image_5: DEFAULT_IMAGES[4],
    preloader_image_6: DEFAULT_IMAGES[5],
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
      alert("All preloader settings saved successfully!");
    } catch (e: any) {
      alert("Failed to save: " + e.message);
    }
    setIsSaving(false);
  };

  const fields = [
    { key: "preloader_text", label: "Preloader Central Text", type: "text" },
    { key: "preloader_image_1", label: "Preloader Image 1", type: "image" },
    { key: "preloader_image_2", label: "Preloader Image 2", type: "image" },
    { key: "preloader_image_3", label: "Preloader Image 3", type: "image" },
    { key: "preloader_image_4", label: "Preloader Image 4", type: "image" },
    { key: "preloader_image_5", label: "Preloader Image 5", type: "image" },
    { key: "preloader_image_6", label: "Preloader Image 6", type: "image" },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Preloader</h2>
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
                    label="Upload Preloader Image"
                  />
                </div>
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
