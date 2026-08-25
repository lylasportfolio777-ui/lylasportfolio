"use client";

import { useState } from "react";
import { updateSiteConfig } from "./actions";
import { 
  Plus, 
  Save, 
  Trash2, 
  HelpCircle, 
  CheckCircle2, 
  Loader2, 
  RefreshCw, 
  Edit3,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Do you travel for weddings and destination shoots?",
    answer: "Absolutely. While we are based in the United States, we regularly travel internationally for weddings, editorials, and commercial campaigns. Travel fees are custom quoted based on the destination."
  },
  {
    id: "faq-2",
    question: "How far in advance should we book?",
    answer: "For weddings, we recommend booking 9 to 12 months in advance, especially for popular fall and spring dates. For portrait and editorial sessions, 4 to 8 weeks is typically sufficient."
  },
  {
    id: "faq-3",
    question: "What is your turnaround time for galleries?",
    answer: "Portrait and editorial sessions are typically delivered within 2-3 weeks. Full wedding galleries take 6-8 weeks, though we always provide a curated sneak peek within 48 hours of the event."
  },
  {
    id: "faq-4",
    question: "Do you provide raw, unedited files?",
    answer: "No. Our editing process is a critical part of our artistic vision. We deliver a meticulously curated and fully retouched gallery that represents our highest standard of quality. We never deliver unfinished work."
  },
  {
    id: "faq-5",
    question: "How do we secure our date?",
    answer: "A signed contract and a 50% non-refundable retainer are required to officially secure your date on our calendar. The remaining balance is due 30 days prior to the event or session."
  }
];

export default function AdminFaqClient({ initialConfig }: { initialConfig: Record<string, string> }) {
  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    if (initialConfig.faq_items) {
      try {
        const parsed = JSON.parse(initialConfig.faq_items);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse FAQs:", e);
      }
    }
    return DEFAULT_FAQS;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFaqChange = (index: number, field: keyof FaqItem, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const handleAddFaq = () => {
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      question: "New Frequently Asked Question",
      answer: "Provide a detailed and helpful answer here."
    };
    setFaqs([...faqs, newFaq]);
  };

  const handleDeleteFaq = (index: number) => {
    if (confirm(`Delete question "${faqs[index].question}"?`)) {
      setFaqs(faqs.filter((_, i) => i !== index));
    }
  };

  const handleMoveFaq = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === faqs.length - 1)) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...faqs];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setFaqs(updated);
  };

  const handleResetDefaults = () => {
    if (confirm("Reset FAQs to default entries? Unsaved changes will be lost.")) {
      setFaqs(DEFAULT_FAQS);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateSiteConfig("faq_items", JSON.stringify(faqs));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (e: any) {
      alert("Failed to save FAQs: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Control Header */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">FAQ & Client Questions</h2>
            <span className="px-2.5 py-0.5 text-[11px] font-mono font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
              {faqs.length} Questions
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage questions and answers displayed on the public FAQ page and structured schema for SEO.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 border border-border hover:bg-surface rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleAddFaq}
            className="px-3.5 py-2 border border-border hover:bg-surface rounded-xl text-xs font-medium text-foreground transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>

          <button
            disabled={isSaving}
            onClick={handleSave}
            className="px-5 py-2 bg-foreground text-background rounded-xl text-xs font-medium hover:opacity-90 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save FAQs</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>FAQ items updated successfully! Changes are now live on your site.</span>
        </div>
      )}

      {/* FAQ Items List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={faq.id || index}
            className="bg-card border border-border p-6 rounded-2xl space-y-4 relative group hover:border-foreground/30 transition-all shadow-xs"
          >
            {/* Top Control Line */}
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-surface border border-border text-foreground/70 font-mono text-xs font-semibold flex items-center justify-center">
                  #{index + 1}
                </span>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  FAQ Item
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={index === 0}
                  onClick={() => handleMoveFaq(index, "up")}
                  className="p-1.5 border border-border rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30"
                  title="Move Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={index === faqs.length - 1}
                  onClick={() => handleMoveFaq(index, "down")}
                  className="p-1.5 border border-border rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30"
                  title="Move Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteFaq(index)}
                  className="p-1.5 border border-border rounded-lg text-red-500 hover:bg-red-500/10 transition-colors ml-2"
                  title="Delete Question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Question Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground block">
                Question
              </label>
              <input
                type="text"
                className="w-full h-10 border border-border rounded-xl px-3 text-xs bg-background text-foreground font-medium focus:outline-none focus:border-foreground/40"
                value={faq.question}
                onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                placeholder="Question text..."
              />
            </div>

            {/* Answer Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground block">
                Answer
              </label>
              <textarea
                rows={3}
                className="w-full p-3 border border-border rounded-xl text-xs bg-background text-foreground focus:outline-none focus:border-foreground/40 leading-relaxed resize-y"
                value={faq.answer}
                onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                placeholder="Detailed answer text..."
              />
            </div>
          </div>
        ))}

        {faqs.length === 0 && (
          <div className="text-center py-16 px-4 border-2 border-dashed border-border rounded-2xl bg-card/50 flex flex-col items-center justify-center">
            <HelpCircle className="w-8 h-8 text-muted-foreground mb-3 opacity-50" />
            <h3 className="text-base font-semibold text-foreground">No FAQ Items</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-6">
              Add common questions and answers to build trust with prospective clients.
            </p>
            <button
              onClick={handleAddFaq}
              className="px-4 py-2 bg-foreground text-background rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Add First Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
