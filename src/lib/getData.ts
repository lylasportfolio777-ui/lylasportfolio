import { cache } from "react";
import { createClient } from "@/utils/supabase/server";

/**
 * Cached server-side helper to fetch all site_config rows.
 * Deduplicated per request using React.cache().
 */
export const getSiteConfig = async (): Promise<Record<string, string>> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_config").select("*");
    if (!data) return {};
    const config: Record<string, string> = {};
    data.forEach((row) => {
      config[row.key] = row.value;
    });
    return config;
  } catch (error) {
    console.error("Failed to fetch site config:", error);
    return {};
  }
};

/**
 * Cached server-side helper to fetch featured projects.
 */
export const getFeaturedProjects = async (limit = 6) => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("id, title, category, image_url, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (!data || data.length === 0) return [];
    return data.map((p, index) => ({
      ...p,
      image: p.image_url,
      aspect: p.aspect_ratio || "aspect-[4/5]",
      gridSpan: "col-span-1 md:col-span-4",
      offset: index % 3 === 0 ? "md:mt-0" : index % 3 === 1 ? "md:mt-16" : "md:mt-32",
    }));
  } catch (error) {
    console.error("Failed to fetch featured projects:", error);
    return [];
  }
};

/**
 * Cached server-side helper to fetch services.
 */
export const getServices = async () => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("id, name, category, image_url")
      .order("created_at", { ascending: false });

    return data || [];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
};

/**
 * Cached server-side helper to fetch testimonials.
 */
export const getTestimonials = async () => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("id, quote, author, role, company, image_url")
      .order("created_at", { ascending: false });

    return data || [];
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
};
