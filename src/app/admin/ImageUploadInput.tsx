"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, Check, Image as ImageIcon, Trash2 } from "lucide-react";
import { deleteCloudinaryAsset } from "./actions";

interface ImageUploadInputProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  multiple?: boolean;
  onMultipleChange?: (urls: string[]) => void;
}

export default function ImageUploadInput({
  value,
  onChange,
  label = "Upload Image",
  multiple = false,
  onMultipleChange,
}: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;

    setIsDeleting(true);
    try {
      await deleteCloudinaryAsset(value);
      onChange("");
    } catch (err: any) {
      console.error("Failed to delete image from Cloudinary:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMsg(null);
    setUploaded(false);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "duk94ehtq";

    try {
      if (multiple && onMultipleChange) {
        const uploadedUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const url = await uploadSingleFile(file, cloudName);
          uploadedUrls.push(url);
        }
        onMultipleChange(uploadedUrls);
        setUploaded(true);
      } else {
        const file = files[0];
        const url = await uploadSingleFile(file, cloudName);
        
        // If there was a previous image, delete it from Cloudinary to free memory
        if (value && typeof value === "string") {
          deleteCloudinaryAsset(value).catch(console.error);
        }

        onChange(url);
        setUploaded(true);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="w-full space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple={multiple}
        className="hidden"
      />

      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer select-none transform-gpu ${
          isUploading
            ? "border-primary/50 bg-primary/5 cursor-wait"
            : "border-border hover:border-foreground/40 hover:bg-surface/50"
        }`}
      >
        {isUploading ? (
          <div className="flex items-center gap-3 py-2 text-foreground/70">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Uploading to Cloudinary...</span>
          </div>
        ) : value ? (
          <div className="flex items-center gap-3 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value && value.includes("cloudinary.com") && value.includes("/upload/") && !value.includes("/upload/f_auto,q_auto") ? value.replace("/upload/", "/upload/f_auto,q_auto,w_200/") : value}
              alt="Uploaded"
              loading="lazy"
              decoding="async"
              className="w-12 h-12 object-cover rounded-lg border border-border shadow-sm shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{value}</p>
              <p className="text-[11px] text-green-600 font-semibold flex items-center gap-1 mt-0.5">
                <Check className="w-3.5 h-3.5" /> Uploaded successfully
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg bg-background hover:bg-surface transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteImage}
                className="px-3 py-1.5 text-xs font-medium border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                title="Delete image directly from Cloudinary"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-3">
            <div className="p-3 bg-surface rounded-full border border-border">
              <Upload className="w-5 h-5 text-foreground/60" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {multiple ? "Select multiple images (PNG, JPG, WEBP)" : "Click to select image file"}
              </p>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="text-xs text-red-500 font-medium px-1">
          {errorMsg}
        </p>
      )}
    </div>
  );
}

async function uploadSingleFile(file: File, cloudName: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "aura_portfolio");

  let res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const fallbackFormData = new FormData();
    fallbackFormData.append("file", file);
    fallbackFormData.append("upload_preset", "ml_default");

    res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: fallbackFormData,
    });
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Cloudinary upload failed (${res.status})`);
  }

  const data = await res.json();
  return data.secure_url;
}
