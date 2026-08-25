"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  CalendarRange,
  Menu,
  X,
  ChevronRight
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const tabs = [
    { id: "bookings_manager", label: "Client Bookings", icon: CalendarCheck, href: "/admin/bookings" },
    { id: "booking_settings", label: "Booking Settings", icon: CalendarRange, href: "/admin/booking-settings" },
    { id: "home_sec", label: "Home Settings", icon: Home },
    { id: "about_sec", label: "About Settings", icon: UserCircle },
    { id: "projects", label: "Gallery & Projects", icon: Images },
    { id: "categories", label: "Categories", icon: Tags },
    { id: "services", label: "Services Offered", icon: Briefcase },
    { id: "pricing", label: "Pricing & Plans", icon: Tag },
    { id: "faq_sec", label: "FAQ Manager", icon: HelpCircle },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { id: "preloader", label: "Preloader", icon: Loader },
    { id: "config", label: "General Settings", icon: Settings },
  ];

  const activeTabObject = tabs.find((t) => t.id === activeTab) || tabs[2];

  const handleTabClick = (tab: (typeof tabs)[0]) => {
    if (tab.href) {
      router.push(tab.href);
    } else {
      setActiveTab(tab.id);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground transform-gpu">
      {/* Sleek Desktop Sidebar */}
      <aside className="w-[280px] lg:w-[300px] border-r border-border h-screen sticky top-0 p-6 lg:p-8 hidden md:flex flex-col bg-surface/90 backdrop-blur-md z-20 shrink-0 transform-gpu">
        <div className="mb-10">
          <h1 className="text-xl lg:text-2xl tracking-[0.1em] uppercase font-light text-foreground">
            Studio<br />
            <span className="text-[10px] text-foreground/40 mt-1.5 block tracking-[0.3em]">Command Center</span>
          </h1>
        </div>
        
        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            if (tab.href) {
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className="group relative flex items-center gap-3.5 px-4 py-3 text-[13px] font-medium rounded-xl text-left transition-colors duration-200 overflow-hidden transform-gpu text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                >
                  <Icon size={16} className="relative z-10 transition-transform duration-200 group-hover:scale-105 shrink-0" />
                  <span className="relative z-10 tracking-wide truncate">{tab.label}</span>
                </Link>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`group relative flex items-center gap-3.5 px-4 py-3 text-[13px] font-medium rounded-xl text-left transition-colors duration-200 overflow-hidden transform-gpu ${
                  isActive
                    ? "text-background bg-foreground shadow-md shadow-foreground/10 font-semibold"
                    : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <Icon size={16} className={`relative z-10 transition-transform duration-200 shrink-0 ${isActive ? "" : "group-hover:scale-105"}`} />
                <span className="relative z-10 tracking-wide truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Logout */}
        <div className="pt-6 mt-auto border-t border-border">
          <form action={logout}>
            <button type="submit" className="group flex items-center gap-3.5 px-4 py-3 text-[13px] font-medium rounded-xl w-full text-left text-red-500 hover:bg-red-500/10 transition-colors">
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform shrink-0" />
              <span className="tracking-wide">Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* High-End Mobile Top Header Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3.5 border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-surface transition-colors"
            aria-label="Open Admin Menu"
          >
            <Menu size={20} />
          </button>
          <div>
            <span className="text-[9px] font-mono tracking-widest uppercase text-foreground/40 block">Studio Admin</span>
            <h2 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-1.5">
              <span>{activeTabObject.label}</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="text-[11px] font-mono px-3 py-1.5 border border-border rounded-lg bg-card text-foreground/80 hover:text-foreground transition-colors"
          >
            View Site ↗
          </Link>
        </div>
      </header>

      {/* Slide-over Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide-in Drawer Container */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[320px] bg-background border-r border-border p-6 flex flex-col justify-between shadow-2xl overflow-hidden"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-6 mb-4 border-b border-border">
                  <div>
                    <h2 className="text-lg font-light tracking-[0.1em] uppercase text-foreground">Studio Admin</h2>
                    <p className="text-[10px] font-mono text-foreground/40 tracking-widest uppercase">Navigation</p>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl border border-border hover:bg-surface text-foreground"
                    aria-label="Close Menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Drawer Navigation Links */}
                <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 custom-scrollbar">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    if (tab.href) {
                      return (
                        <Link
                          key={tab.id}
                          href={tab.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between px-3.5 py-3 text-xs font-medium rounded-xl text-foreground/70 hover:bg-surface hover:text-foreground transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={16} className="text-foreground/50" />
                            <span>{tab.label}</span>
                          </div>
                          <ChevronRight size={14} className="text-foreground/30" />
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab)}
                        className={`flex items-center justify-between px-3.5 py-3 text-xs font-medium rounded-xl text-left transition-colors ${
                          isActive
                            ? "bg-foreground text-background font-semibold"
                            : "text-foreground/70 hover:bg-surface hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={16} className={isActive ? "text-background" : "text-foreground/50"} />
                          <span>{tab.label}</span>
                        </div>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-background" />}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Sign Out Footer */}
              <div className="pt-4 border-t border-border">
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center gap-3 w-full px-3.5 py-3 text-xs font-medium rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen bg-background relative z-10 text-foreground pb-24 md:pb-32 w-full max-w-full overflow-x-hidden">
        {/* Ambient Glow */}
        <div className="fixed top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-foreground/5 rounded-full blur-[100px] md:blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-12 relative z-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="transform-gpu w-full"
            >
              {activeTab === "projects" && <AdminProjectsClient initialProjects={initialProjects} initialCategories={initialCategories} />}
              {activeTab === "categories" && <AdminCategoriesClient initialCategories={initialCategories} />}
              {activeTab === "home_sec" && <AdminHomeClient initialConfig={initialConfig} />}
              {activeTab === "about_sec" && <AdminAboutClient initialConfig={initialConfig} />}
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

