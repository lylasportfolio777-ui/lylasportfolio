const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, category, image_url, aspect_ratio, created_at")
    .order("created_at", { ascending: false })
    .limit(6);
  console.log("DATA:", JSON.stringify(data, null, 2));
  console.log("ERROR:", error);
}
run();
