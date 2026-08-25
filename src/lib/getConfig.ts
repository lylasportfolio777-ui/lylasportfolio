/**
 * Server-side helper to fetch all site_config rows.
 * Called in Server Components (pages/layouts) and passed as props to client
 * children — eliminates redundant client-side DB calls.
 * Note: unstable_cache cannot be used here because the Supabase server client
 * internally calls cookies(), which is a dynamic data source.
 */
import { createClient } from "@/utils/supabase/server";

export async function getSiteConfig(): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_config").select("*");
  if (!data) return {};
  const config: Record<string, string> = {};
  data.forEach((row) => { config[row.key] = row.value; });
  return config;
}
