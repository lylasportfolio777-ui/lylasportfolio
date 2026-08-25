"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/app/login/actions";
import AdminProjectsClient from "./AdminProjectsClient";
import AdminServicesClient from "./AdminServicesClient";
import AdminPricingClient from "./AdminPricingClient";
import AdminTestimonialsClient from "./AdminTestimonialsClient";
import AdminConfigClient from "./AdminConfigClient";
import AdminCategoriesClient from "./AdminCategoriesClient";
import AdminPreloaderClient from "./AdminPreloaderClient";
import AdminHomeClient from "./AdminHomeClient";
import AdminAboutClient from "./AdminAboutClient";
import AdminBTSClient from "./AdminBTSClient";
import AdminFaqClient from "./AdminFaqClient";

import { 
  Images, 
  Tags, 
  Home, 
  UserCircle, 
  Camera, 
  Briefcase, 
  MessageSquareQuote, 
  Loader, 
  Settings,
  LogOut,
  Tag,
  HelpCircle,
  CalendarCheck,
  CalendarRange
} from "lucide-react";

export default function AdminDashboardClient({ 
  initialProjects, 
  initialCategories,
  initialServices, 
  initialTestimonials, 
  initialConfig 
}: { 
  initialProjects: any[], 
  initialCategories: any[],
  initialServices: any[], 
  initialTestimonials: any[], 
  initialConfig: Record<string, string> 
}) {
  const [activeTab, setActiveTab] = useState("home_sec");

  const tabs = [
    { id: "bookings_manager", label: "Client Bookings", icon: CalendarCheck, href: "/admin/bookings" },
    { id: "booking_settings", label: "Booking Settings", icon: CalendarRange, href: "/admin/booking-settings" },
    { id: "home_sec", label: "Home Settings", icon: Home },
    { id: "about_sec", label: "About Settings", icon: UserCircle },
    { id: "projects", label: "Gallery & Projects", icon: Images },
    { id: "categories", label: "Categories", icon: Tags },
    { id: "bts_sec", label: "Behind the Scenes", icon: Camera },
    { id: "services", label: "Services Offered", icon: Briefcase },
    { id: "pricing", label: "Pricing & Plans", icon: Tag },
    { id: "faq_sec", label: "FAQ Manager", icon: HelpCircle },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { id: "preloader", label: "Preloader", icon: Loader },
    { id: "config", label: "General Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground transform-gpu">
      {/* Optimized Sleek Left Sidebar */}
      <aside className="w-[300px] border-r border-border h-screen sticky top-0 p-8 hidden md:flex flex-col bg-surface/90 backdrop-blur-md z-20 shrink-0 transform-gpu">
        <div className="mb-12">
          <h1 className="text-2xl tracking-[0.1em] uppercase font-light text-foreground">
            Studio<br />
            <span className="text-[10px] text-foreground/40 mt-2 block tracking-[0.3em]">Command Center</span>
          </h1>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto pr-4 custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            if (tab.href) {
              return (
                <a
                  key={tab.id}
                  href={tab.href}
                  className="group relative flex items-center gap-4 px-4 py-3 text-[13px] font-medium rounded-xl text-left transition-colors duration-200 overflow-hidden transform-gpu text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                >
                  <Icon size={16} className="relative z-10 transition-transform duration-200 group-hover:scale-105" />
                  <span className="relative z-10 tracking-wide">{tab.label}</span>
                </a>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-4 px-4 py-3 text-[13px] font-medium rounded-xl text-left transition-colors duration-200 overflow-hidden transform-gpu ${
                  isActive
                    ? "text-background bg-foreground shadow-md shadow-foreground/10"
                    : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <Icon size={16} className={`relative z-10 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-105"}`} />
                <span className="relative z-10 tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Logout */}
        <div className="pt-8 mt-auto border-t border-border">
          <form action={logout}>
            <button type="submit" className="group flex items-center gap-4 px-4 py-3 text-[13px] font-medium rounded-xl w-full text-left text-red-500 hover:bg-red-500/10 transition-colors">
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="tracking-wide">Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen bg-background relative z-10 text-foreground pb-32">
        {/* Soft Ambient Glow */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-foreground/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-6 border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-50">
          <h1 className="text-lg font-light tracking-widest uppercase">Admin Panel</h1>
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value)}
            className="border border-border bg-card text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>{tab.label}</option>
            ))}
          </select>
        </div>

        <div className="max-w-6xl mx-auto p-6 md:p-12 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="transform-gpu"
            >
              {activeTab === "projects" && <AdminProjectsClient initialProjects={initialProjects} initialCategories={initialCategories} />}
              {activeTab === "categories" && <AdminCategoriesClient initialCategories={initialCategories} />}
              {activeTab === "home_sec" && <AdminHomeClient initialConfig={initialConfig} />}
              {activeTab === "about_sec" && <AdminAboutClient initialConfig={initialConfig} />}
              {activeTab === "bts_sec" && <AdminBTSClient initialConfig={initialConfig} />}
              {activeTab === "services" && <AdminServicesClient initialServices={initialServices} />}
              {activeTab === "pricing" && <AdminPricingClient initialConfig={initialConfig} />}
              {activeTab === "faq_sec" && <AdminFaqClient initialConfig={initialConfig} />}
              {activeTab === "testimonials" && <AdminTestimonialsClient initialTestimonials={initialTestimonials} />}
              {activeTab === "preloader" && <AdminPreloaderClient initialConfig={initialConfig} />}
              {activeTab === "config" && <AdminConfigClient initialConfig={initialConfig} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
