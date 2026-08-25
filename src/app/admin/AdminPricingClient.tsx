"use client";

import { useState } from "react";
import { updateSiteConfig } from "./actions";
import { 
  Plus, 
  Save, 
  Trash2, 
  Tag, 
  CheckCircle2, 
  Loader2,
  RefreshCw,
  Star,
  DollarSign
} from "lucide-react";

export interface PricingPlan {
  id?: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
  ctaText?: string;
}

const DEFAULT_PRICING_PLANS: PricingPlan[] = [
  {
    id: "plan-1",
    name: "Portrait Session",
    price: "$1,200",
    description: "Intimate, high-end portraiture focusing on character, mood, and dramatic light.",
    features: ["2 Hour Session", "Studio or Location", "15 Retouched High-Res Images", "Private Online Gallery"],
    featured: false,
    ctaText: "Inquire Now",
  },
  {
    id: "plan-2",
    name: "Editorial Feature",
    price: "$3,500",
    description: "Full-day conceptual shoot designed for publications, lookbooks, and brand fashion.",
    features: ["8 Hour Full Production", "Creative & Art Direction", "Full Digital Lookbook", "Commercial Usage Rights"],
    featured: true,
    ctaText: "Book Campaign",
  },
  {
    id: "plan-3",
    name: "Global Campaign",
    price: "Custom",
    description: "Large scale multi-day productions for international brands, agencies, and global campaigns.",
    features: ["Multi-day Worldwide Shoot", "Full Production & Styling Team", "Global Media Usage Rights", "Custom Retouching Suite"],
    featured: false,
    ctaText: "Request Quote",
  },
];

export default function AdminPricingClient({ initialConfig }: { initialConfig: Record<string, string> }) {
  const [plans, setPlans] = useState<PricingPlan[]>(() => {
    if (initialConfig.pricing_plans) {
      try {
        const parsed = JSON.parse(initialConfig.pricing_plans);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse pricing plans:", e);
      }
    }
    return DEFAULT_PRICING_PLANS;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handlePlanChange = (index: number, field: keyof PricingPlan, value: any) => {
    const updated = [...plans];
    updated[index] = { ...updated[index], [field]: value };
    setPlans(updated);
  };

  const handleFeaturesChange = (index: number, featuresStr: string) => {
    const featureList = featuresStr.split(",").map((f) => f.trim());
    handlePlanChange(index, "features", featureList);
  };

  const handleAddPlan = () => {
    const newPlan: PricingPlan = {
      id: `plan-${Date.now()}`,
      name: "New Investment Tier",
      price: "$2,000",
      description: "Description of package inclusions and value.",
      features: ["Deliverable 1", "Deliverable 2", "Usage Rights"],
      featured: false,
      ctaText: "Inquire Now",
    };
    setPlans([...plans, newPlan]);
  };

  const handleDeletePlan = (index: number) => {
    if (confirm(`Delete investment plan "${plans[index].name}"?`)) {
      setPlans(plans.filter((_, i) => i !== index));
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset pricing plans to default packages? Unsaved changes will be lost.")) {
      setPlans(DEFAULT_PRICING_PLANS);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateSiteConfig("pricing_plans", JSON.stringify(plans));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (e: any) {
      alert("Failed to save pricing: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      {/* Header Controls */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">Pricing & Investment Packages</h2>
            <span className="px-2.5 py-0.5 text-[11px] font-mono font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
              {plans.length} Tiers
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage investment pricing tiers, features, and call-to-action buttons displayed on the pricing section.
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
            onClick={handleAddPlan}
            className="px-3.5 py-2 border border-border hover:bg-surface rounded-xl text-xs font-medium text-foreground transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Pricing Plan</span>
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
                <span>Save Pricing</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Pricing plans updated successfully! Changes are now live on your site.</span>
        </div>
      )}

      {/* Pricing Cards List */}
      <div className="space-y-6">
        {plans.map((plan, index) => (
          <div
            key={plan.id || index}
            className={`bg-card border ${
              plan.featured ? "border-primary/50 shadow-md ring-1 ring-primary/20" : "border-border"
            } p-6 rounded-2xl space-y-4 relative group transition-all`}
          >
            {/* Top Bar inside Card */}
            <div className="flex justify-between items-center border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-surface border border-border text-foreground/70 font-mono text-xs font-semibold flex items-center justify-center">
                  #{index + 1}
                </span>
                <input
                  type="text"
                  className="font-semibold text-base bg-transparent border-b border-transparent focus:border-border text-foreground focus:outline-none"
                  value={plan.name}
                  onChange={(e) => handlePlanChange(index, "name", e.target.value)}
                  placeholder="Plan Name"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={!!plan.featured}
                    onChange={(e) => handlePlanChange(index, "featured", e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="flex items-center gap-1">
                    <Star className={`w-3.5 h-3.5 ${plan.featured ? "text-amber-400 fill-amber-400" : ""}`} />
                    <span>Most Popular Badge</span>
                  </span>
                </label>

                <button
                  onClick={() => handleDeletePlan(index)}
                  className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                  title="Delete plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Price Tag */}
              <div className="md:col-span-4 space-y-1">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-primary" />
                  <span>Price / Rate Tag</span>
                </label>
                <input
                  type="text"
                  className="w-full h-10 border border-border rounded-xl px-3 text-xs bg-background text-foreground font-mono focus:outline-none focus:border-foreground/40"
                  value={plan.price}
                  onChange={(e) => handlePlanChange(index, "price", e.target.value)}
                  placeholder="e.g. $1,200 or Custom"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-8 space-y-1">
                <label className="text-xs font-medium text-muted-foreground block">
                  Package Summary
                </label>
                <input
                  type="text"
                  className="w-full h-10 border border-border rounded-xl px-3 text-xs bg-background text-foreground focus:outline-none focus:border-foreground/40"
                  value={plan.description}
                  onChange={(e) => handlePlanChange(index, "description", e.target.value)}
                  placeholder="Short package summary..."
                />
              </div>

              {/* Features List (Comma separated) */}
              <div className="md:col-span-12 space-y-1">
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Package Bullet Features (Comma separated)</span>
                  <span className="text-[10px] text-muted-foreground font-mono">e.g. 2 Hour Shoot, Studio Location, Retouched Photos</span>
                </label>
                <input
                  type="text"
                  className="w-full h-10 border border-border rounded-xl px-3 text-xs bg-background text-foreground focus:outline-none focus:border-foreground/40"
                  value={Array.isArray(plan.features) ? plan.features.join(", ") : ""}
                  onChange={(e) => handleFeaturesChange(index, e.target.value)}
                  placeholder="2 Hour Session, Studio or Location, 15 Retouched Images"
                />
              </div>

              {/* Button Text */}
              <div className="md:col-span-6 space-y-1">
                <label className="text-xs font-medium text-muted-foreground block">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  className="w-full h-10 border border-border rounded-xl px-3 text-xs bg-background text-foreground focus:outline-none focus:border-foreground/40"
                  value={plan.ctaText || "Inquire Now"}
                  onChange={(e) => handlePlanChange(index, "ctaText", e.target.value)}
                  placeholder="Inquire Now"
                />
              </div>
            </div>
          </div>
        ))}

        {plans.length === 0 && (
          <div className="text-center py-16 px-4 border-2 border-dashed border-border rounded-2xl bg-card/50 flex flex-col items-center justify-center">
            <Tag className="w-8 h-8 text-muted-foreground mb-3 opacity-50" />
            <h3 className="text-base font-semibold text-foreground">No Investment Packages</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-6">
              Create transparent pricing tiers for your clients.
            </p>
            <button
              onClick={handleAddPlan}
              className="px-4 py-2 bg-foreground text-background rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Add First Pricing Tier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
