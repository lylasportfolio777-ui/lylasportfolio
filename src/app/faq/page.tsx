import { constructMetadata } from "@/lib/seo/metadata";
import { generateFAQSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import FaqClient from "./FaqClient";
import { createClient } from "@/utils/supabase/server";

export const metadata = constructMetadata({
  title: "FAQ",
  description: "Common questions about our photography services, travel, and booking process.",
  path: "/faq"
});

const DEFAULT_FAQS = [
  {
    question: "Do you travel for weddings and destination shoots?",
    answer: "Absolutely. While we are based in the United States, we regularly travel internationally for weddings, editorials, and commercial campaigns. Travel fees are custom quoted based on the destination."
  },
  {
    question: "How far in advance should we book?",
    answer: "For weddings, we recommend booking 9 to 12 months in advance, especially for popular fall and spring dates. For portrait and editorial sessions, 4 to 8 weeks is typically sufficient."
  },
  {
    question: "What is your turnaround time for galleries?",
    answer: "Portrait and editorial sessions are typically delivered within 2-3 weeks. Full wedding galleries take 6-8 weeks, though we always provide a curated sneak peek within 48 hours of the event."
  },
  {
    question: "Do you provide raw, unedited files?",
    answer: "No. Our editing process is a critical part of our artistic vision. We deliver a meticulously curated and fully retouched gallery that represents our highest standard of quality. We never deliver unfinished work."
  },
  {
    question: "How do we secure our date?",
    answer: "A signed contract and a 50% non-refundable retainer are required to officially secure your date on our calendar. The remaining balance is due 30 days prior to the event or session."
  }
];

export default async function FaqPage() {
  let faqs = DEFAULT_FAQS;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_config").select("value").eq("key", "faq_items").single();
    if (data?.value) {
      const parsed = JSON.parse(data.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        faqs = parsed;
      }
    }
  } catch {
    /* fallback to default faqs */
  }

  return (
    <>
      <JsonLd data={generateFAQSchema(faqs)} id="faq-schema" />
      <FaqClient faqs={faqs} />
    </>
  );
}
