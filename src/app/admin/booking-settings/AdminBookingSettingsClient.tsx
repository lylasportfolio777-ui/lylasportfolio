"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Save,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Loader2,
} from "lucide-react";

interface WorkingDayConfig {
  enabled: boolean;
  start: string;
  end: string;
}

interface ServiceItem {
  id: string;
  name: string;
  duration: number;
  description: string;
  active: boolean;
}

const TIMEZONE_OPTIONS = [
  { label: "US Eastern Time (New York, Miami, Boston)", value: "America/New_York" },
  { label: "US Central Time (Chicago, Dallas, Houston)", value: "America/Chicago" },
  { label: "US Mountain Time (Denver, Salt Lake City)", value: "America/Denver" },
  { label: "US Arizona Time (Phoenix - No DST)", value: "America/Phoenix" },
  { label: "US Pacific Time (Los Angeles, SF, Seattle)", value: "America/Los_Angeles" },
  { label: "US Alaska Time (Anchorage)", value: "America/Anchorage" },
  { label: "US Hawaii Time (Honolulu)", value: "Pacific/Honolulu" },
  { label: "UK / London (GMT / BST)", value: "Europe/London" },
  { label: "Central Europe (Paris, Berlin, Rome)", value: "Europe/Paris" },
  { label: "India Standard Time (IST)", value: "Asia/Kolkata" },
  { label: "Dubai / UAE (GST)", value: "Asia/Dubai" },
  { label: "Australia Eastern (Sydney, Melbourne)", value: "Australia/Sydney" },
];

export default function AdminBookingSettingsClient() {
  const [slotDuration, setSlotDuration] = useState(60);
  const [bufferDuration, setBufferDuration] = useState(30);
  const [minAdvanceHours, setMinAdvanceHours] = useState(24);
  const [maxAdvanceDays, setMaxAdvanceDays] = useState(180);
  const [maxBookingsPerDay, setMaxBookingsPerDay] = useState(4);
  const [timezone, setTimezone] = useState("America/New_York");

  const [workingHours, setWorkingHours] = useState<Record<string, WorkingDayConfig>>({
    monday: { enabled: true, start: "09:00", end: "18:00" },
    tuesday: { enabled: true, start: "09:00", end: "18:00" },
    wednesday: { enabled: true, start: "09:00", end: "18:00" },
    thursday: { enabled: true, start: "09:00", end: "18:00" },
    friday: { enabled: true, start: "09:00", end: "18:00" },
    saturday: { enabled: true, start: "10:00", end: "17:00" },
    sunday: { enabled: false, start: "10:00", end: "17:00" },
  });

  const [services, setServices] = useState<ServiceItem[]>([
    { id: "wedding", name: "Wedding Photography", duration: 120, description: "Full day luxury coverage", active: true },
    { id: "pre-wedding", name: "Pre-Wedding Shoot", duration: 90, description: "Outdoor portrait session", active: true },
    { id: "portrait", name: "Portrait Session", duration: 60, description: "Personal portraiture", active: true },
    { id: "couple", name: "Couple Session", duration: 60, description: "Cinematic couple session", active: true },
    { id: "family", name: "Family Photography", duration: 60, description: "Family portraits", active: true },
    { id: "event", name: "Event Photography", duration: 120, description: "Private & commercial event", active: true },
    { id: "custom", name: "Custom Session", duration: 60, description: "Bespoke package", active: true },
  ]);

  const [googleStatus, setGoogleStatus] = useState<{ connected: boolean; email?: string | null }>({
    connected: false,
    email: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          const s = data.settings;
          setSlotDuration(s.slot_duration_minutes || 60);
          setBufferDuration(s.buffer_duration_minutes || 30);
          setMinAdvanceHours(s.min_advance_hours ?? 24);
          setMaxAdvanceDays(s.max_advance_days ?? 180);
          setMaxBookingsPerDay(s.max_bookings_per_day ?? 4);
          setTimezone(s.timezone || "America/New_York");
          if (s.working_hours) setWorkingHours(s.working_hours);
          if (s.services) setServices(s.services);
        }
        if (data.googleCalendar) {
          setGoogleStatus(data.googleCalendar);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
        setIsLoading(false);
      });
  }, []);

  const handleDayToggle = (day: string) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const handleWorkingHoursChange = (day: string, field: "start" | "end", val: string) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: val },
    }));
  };

  const handleServiceChange = (id: string, field: keyof ServiceItem, val: unknown) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const handleAddService = () => {
    const newId = `service-${Date.now()}`;
    setServices((prev) => [
      ...prev,
      { id: newId, name: "New Session Package", duration: 60, description: "Description...", active: true },
    ]);
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_duration_minutes: Number(slotDuration),
          buffer_duration_minutes: Number(bufferDuration),
          min_advance_hours: Number(minAdvanceHours),
          max_advance_days: Number(maxAdvanceDays),
          max_bookings_per_day: Number(maxBookingsPerDay),
          timezone,
          working_hours: workingHours,
          services,
        }),
      });

      if (res.ok) {
        setSaveMessage("Settings saved successfully.");
      } else {
        const errData = await res.json();
        setSaveMessage(errData.error || "Failed to save settings.");
      }
    } catch (err) {
      console.error("Save error:", err);
      setSaveMessage("Network error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const daysList = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light pt-32 pb-20 px-8 flex justify-center items-center">
        <Loader2 className="animate-spin text-dark" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light text-dark pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-dark/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C9A96E]">System Configuration</span>
            <h1 className="text-4xl md:text-5xl font-light text-dark uppercase tracking-tight">Booking Settings</h1>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="self-start md:self-auto px-8 py-4 bg-[#1C1D20] text-white rounded-full text-xs font-mono uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{isSaving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>

        {saveMessage && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 rounded-2xl text-xs font-mono">
            {saveMessage}
          </div>
        )}

        {/* GOOGLE CALENDAR OAUTH SECTION */}
        <div className="bg-[#FAFAF7] border border-dark/15 rounded-3xl p-8 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-dark/10 pb-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} className="text-[#C9A96E]" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-dark/40">OAuth 2.0 Integration</span>
                <h3 className="text-xl font-light text-dark uppercase">Google Calendar Integration</h3>
              </div>
            </div>
            {googleStatus.connected ? (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Connected
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-500/10 text-amber-700 border border-amber-500/30 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5">
                <AlertCircle size={14} /> Not Connected
              </span>
            )}
          </div>

          <p className="text-xs font-mono text-dark/70 leading-relaxed">
            Connecting Google Calendar automatically creates events in your personal Google Calendar account when clients book on your website. View all upcoming shoots on your phone's official Google Calendar mobile app!
          </p>

          {googleStatus.connected ? (
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-dark/10 text-xs font-mono">
              <div>
                <span className="text-dark/40 block">CONNECTED ACCOUNT</span>
                <span className="text-dark font-medium">{googleStatus.email || "Primary Calendar"}</span>
              </div>
              <a
                href="/api/auth/google"
                className="px-5 py-2.5 bg-dark/5 text-dark border border-dark/20 rounded-full hover:bg-dark/10 transition-colors flex items-center gap-1.5"
              >
                <ExternalLink size={14} /> Reconnect
              </a>
            </div>
          ) : (
            <a
              href="/api/auth/google"
              className="self-start px-8 py-4 bg-[#1C1D20] text-white rounded-full text-xs font-mono uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2"
            >
              <span>Connect Photographer Google Calendar</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        {/* TIME & BUFFER SETTINGS */}
        <div className="bg-[#FAFAF7] border border-dark/15 rounded-3xl p-8 shadow-xl flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-dark/10 pb-4">
            <Clock size={20} className="text-[#C9A96E]" />
            <h3 className="text-xl font-light text-dark uppercase font-mono">Time Slot & Buffer Rules</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
            <div className="flex flex-col gap-2">
              <label className="text-dark/60 uppercase">Default Shoot Duration (Minutes)</label>
              <input
                type="number"
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
                className="p-3 bg-white border border-dark/15 rounded-xl text-sm font-mono text-dark outline-none focus:border-dark"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-dark/60 uppercase">Buffer Between Shoots (Minutes)</label>
              <input
                type="number"
                value={bufferDuration}
                onChange={(e) => setBufferDuration(Number(e.target.value))}
                className="p-3 bg-white border border-dark/15 rounded-xl text-sm font-mono text-dark outline-none focus:border-dark"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-dark/60 uppercase">Max Bookings Per Day</label>
              <input
                type="number"
                value={maxBookingsPerDay}
                onChange={(e) => setMaxBookingsPerDay(Number(e.target.value))}
                className="p-3 bg-white border border-dark/15 rounded-xl text-sm font-mono text-dark outline-none focus:border-dark"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-dark/60 uppercase">Minimum Advance Booking (Hours)</label>
              <input
                type="number"
                value={minAdvanceHours}
                onChange={(e) => setMinAdvanceHours(Number(e.target.value))}
                className="p-3 bg-white border border-dark/15 rounded-xl text-sm font-mono text-dark outline-none focus:border-dark"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-dark/60 uppercase">Max Advance Booking Window (Days)</label>
              <input
                type="number"
                value={maxAdvanceDays}
                onChange={(e) => setMaxAdvanceDays(Number(e.target.value))}
                className="p-3 bg-white border border-dark/15 rounded-xl text-sm font-mono text-dark outline-none focus:border-dark"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-dark/60 uppercase">Photographer Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="p-3 bg-white border border-dark/15 rounded-xl text-sm font-mono text-dark outline-none focus:border-dark cursor-pointer"
              >
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* WORKING DAYS & HOURS */}
        <div className="bg-[#FAFAF7] border border-dark/15 rounded-3xl p-8 shadow-xl flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-dark/10 pb-4">
            <Calendar size={20} className="text-[#C9A96E]" />
            <h3 className="text-xl font-light text-dark uppercase font-mono">Photographer Working Hours</h3>
          </div>

          <div className="flex flex-col gap-4">
            {daysList.map((day) => {
              const conf = workingHours[day] || { enabled: false, start: "09:00", end: "18:00" };
              return (
                <div
                  key={day}
                  className="flex items-center justify-between p-4 bg-white border border-dark/10 rounded-2xl text-xs font-mono"
                >
                  <div className="flex items-center gap-4 w-36">
                    <input
                      type="checkbox"
                      checked={conf.enabled}
                      onChange={() => handleDayToggle(day)}
                      className="w-4 h-4 rounded cursor-pointer accent-[#1C1D20]"
                    />
                    <span className="uppercase font-semibold text-dark">{day}</span>
                  </div>

                  {conf.enabled ? (
                    <div className="flex items-center gap-3">
                      <span>Start:</span>
                      <input
                        type="time"
                        value={conf.start}
                        onChange={(e) => handleWorkingHoursChange(day, "start", e.target.value)}
                        className="p-2 border border-dark/15 rounded-lg outline-none"
                      />
                      <span>End:</span>
                      <input
                        type="time"
                        value={conf.end}
                        onChange={(e) => handleWorkingHoursChange(day, "end", e.target.value)}
                        className="p-2 border border-dark/15 rounded-lg outline-none"
                      />
                    </div>
                  ) : (
                    <span className="text-dark/40 italic">Unavailable / Day Off</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SERVICES MANAGEMENT */}
        <div className="bg-[#FAFAF7] border border-dark/15 rounded-3xl p-8 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-dark/10 pb-4">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-[#C9A96E]" />
              <h3 className="text-xl font-light text-dark uppercase font-mono">Photography Services</h3>
            </div>
            <button
              onClick={handleAddService}
              className="px-4 py-2 bg-dark/5 text-dark border border-dark/15 rounded-full text-xs font-mono hover:bg-dark/10 transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Service
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {services.map((s) => (
              <div key={s.id} className="p-4 bg-white border border-dark/10 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    value={s.name}
                    onChange={(e) => handleServiceChange(s.id, "name", e.target.value)}
                    className="font-mono text-sm font-semibold text-dark border-b border-dark/15 bg-transparent outline-none focus:border-dark py-1 flex-1"
                    placeholder="Service Name"
                  />
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-mono cursor-pointer">
                      <input
                        type="checkbox"
                        checked={s.active}
                        onChange={(e) => handleServiceChange(s.id, "active", e.target.checked)}
                        className="accent-[#1C1D20]"
                      />
                      <span>Active</span>
                    </label>
                    <button
                      onClick={() => handleDeleteService(s.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <input
                    type="text"
                    value={s.description}
                    onChange={(e) => handleServiceChange(s.id, "description", e.target.value)}
                    className="p-2 border border-dark/15 rounded-lg outline-none"
                    placeholder="Short description"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-dark/60">Duration (mins):</span>
                    <input
                      type="number"
                      value={s.duration}
                      onChange={(e) => handleServiceChange(s.id, "duration", Number(e.target.value))}
                      className="p-2 border border-dark/15 rounded-lg outline-none w-24"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
