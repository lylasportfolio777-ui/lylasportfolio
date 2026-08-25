import { constructMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/utils/supabase/server";
import AboutContent from "./AboutContent";

export const metadata = constructMetadata({
  title: "About",
  description: "Learn about our artistic vision, experience, and approach to capturing timeless photography.",
  path: "/about"
});

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: configData } = await supabase.from("site_config").select("*");

  const config: Record<string, string> = {};
  if (configData) {
    configData.forEach((item: any) => {
      config[item.key] = item.value;
    });
  }

  return <AboutContent config={config} />;
}
