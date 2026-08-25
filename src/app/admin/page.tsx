import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Check auth user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  let projects: any[] = [];
  let categories: any[] = [];
  let services: any[] = [];
  let testimonials: any[] = [];
  const initialConfig: Record<string, string> = {};

  try {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) projects = data;
  } catch (e) {
    console.error("Failed to load projects:", e);
  }

  try {
    const { data } = await supabase.from("project_categories").select("*").order("name", { ascending: true });
    if (data) categories = data;
  } catch (e) {
    console.error("Failed to load categories:", e);
  }

  try {
    const { data } = await supabase.from("services").select("*").order("created_at", { ascending: false });
    if (data) services = data;
  } catch (e) {
    console.error("Failed to load services:", e);
  }

  try {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (data) testimonials = data;
  } catch (e) {
    console.error("Failed to load testimonials:", e);
  }

  try {
    const { data: configData } = await supabase.from("site_config").select("*");
    if (configData) {
      configData.forEach((item: any) => {
        initialConfig[item.key] = item.value;
      });
    }
  } catch (e) {
    console.error("Failed to load site config:", e);
  }

  return (
    <AdminDashboardClient 
      initialProjects={projects}
      initialCategories={categories}
      initialServices={services}
      initialTestimonials={testimonials}
      initialConfig={initialConfig}
    />
  );
}
