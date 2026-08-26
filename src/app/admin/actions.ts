"use server";

import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// --- CLOUDINARY ASSET DELETION ---
export async function deleteCloudinaryAsset(imageUrl: string) {
  if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.includes("cloudinary.com")) {
    return { success: false, message: "Not a Cloudinary image URL" };
  }

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "duk94ehtq";
    const apiKey = process.env.CLOUDINARY_API_KEY || "379348247179824";
    const apiSecret = process.env.CLOUDINARY_API_SECRET || "8uMk3KmALTX7mHWoRjt7J2kTE2I";

    // Extract public_id from Cloudinary URL
    // e.g. https://res.cloudinary.com/duk94ehtq/image/upload/v1761547569/folder/sample.jpg -> folder/sample
    const urlParts = imageUrl.split("/upload/");
    if (urlParts.length < 2) return { success: false, message: "Invalid Cloudinary URL" };

    let pathAfterUpload = urlParts[1];
    // Remove version prefix if present (e.g. v1761547569/)
    pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, "");

    // Remove file extension (.jpg, .png, .webp, .avif, etc.)
    const lastDotIndex = pathAfterUpload.lastIndexOf(".");
    const publicId = lastDotIndex !== -1 ? pathAfterUpload.substring(0, lastDotIndex) : pathAfterUpload;

    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

    const formData = new URLSearchParams();
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await res.json();
    console.log(`[Cloudinary Cleanup] Destroy result for '${publicId}':`, data);
    return { success: data.result === "ok" || data.result === "not_found", data };
  } catch (err: any) {
    console.error("[Cloudinary Cleanup Error]:", err);
    return { success: false, error: err.message };
  }
}

// --- PROJECTS ---
export async function deleteProject(id: string) {
  const supabase = await createClient();
  
  // Fetch project image URLs before deletion to clean up Cloudinary storage
  const { data: project } = await supabase.from("projects").select("image_url, gallery_urls").eq("id", id).single();
  if (project) {
    if (project.image_url) await deleteCloudinaryAsset(project.image_url);
    if (Array.isArray(project.gallery_urls)) {
      for (const url of project.gallery_urls) {
        if (url) await deleteCloudinaryAsset(url);
      }
    }
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function addProject(data: { title: string; category: string; year: string; image_url: string; description?: string; gallery_urls?: string[]; }) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

// --- SERVICES ---
export async function deleteService(id: string) {
  const supabase = await createClient();
  const { data: service } = await supabase.from("services").select("image_url").eq("id", id).single();
  if (service?.image_url) {
    await deleteCloudinaryAsset(service.image_url);
  }

  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function addService(data: { name: string; category: string; image_url: string; price?: string; description?: string; features?: string[]; is_featured?: boolean }) {
  const supabase = await createClient();
  const { data: inserted, error } = await supabase.from("services").insert([data]).select("id").single();
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  return inserted?.id || `svc-${Date.now()}`;
}

export async function updateService(id: string, data: Partial<{ name: string; category: string; image_url: string; price?: string; description?: string; features?: string[]; is_featured?: boolean }>) {
  const supabase = await createClient();
  const { error } = await supabase.from("services").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

// --- TESTIMONIALS ---
export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { data: item } = await supabase.from("testimonials").select("image_url").eq("id", id).single();
  if (item?.image_url) {
    await deleteCloudinaryAsset(item.image_url);
  }

  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function addTestimonial(data: { quote: string; author: string; role: string; company: string; image_url: string; }) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

// --- SITE CONFIG ---
export async function updateSiteConfig(key: string, value: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("site_config").upsert({ key, value });
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function updateSiteConfigs(configs: Record<string, string>) {
  const supabase = await createClient();
  const payload = Object.entries(configs).map(([key, value]) => ({ key, value }));
  const { error } = await supabase.from("site_config").upsert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}
// --- CATEGORIES ---
export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("project_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function addCategory(name: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("project_categories").insert([{ name }]).select().single();
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  return data;
}
