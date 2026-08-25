"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Camera,
} from "lucide-react";

interface Booking {
  id: string;
  created_at: string;
  client_name: string;
  email: string;
  phone: string;
  service: string;
  event_type: string;
  location: string;
  message?: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  google_event_id?: string;
  google_calendar_id?: string;
}

export default function AdminBookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [sortView, setSortView] = useState<"upcoming" | "newest">("upcoming");

  // Reschedule Modal State
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const url = `/api/admin/bookings?search=${encodeURIComponent(searchQuery)}&sort=${sortView}`;
      const res = await fetch(url);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [sortView]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", status: newStatus }),
      });
      if (res.ok) {
        fetchBookings();
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this booking?")) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchBookings();
        setSelectedBooking(null);
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  const handleOpenReschedule = (b: Booking) => {
    setRescheduleBooking(b);
    setRescheduleDate(b.booking_date);
    setRescheduleTime(b.start_time.substring(0, 5));
    setRescheduleError(null);
  };

  const handleSubmitReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleBooking) return;
    setIsRescheduling(true);
    setRescheduleError(null);

    try {
      const res = await fetch(`/api/admin/bookings/${rescheduleBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reschedule",
          booking_date: rescheduleDate,
          start_time: rescheduleTime,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setRescheduleError(data.error || "Failed to reschedule booking.");
        setIsRescheduling(false);
        return;
      }

      setIsRescheduling(false);
      setRescheduleBooking(null);
      fetchBookings();
    } catch (err) {
      console.error("Reschedule error:", err);
      setRescheduleError("Network error occurred.");
      setIsRescheduling(false);
    }
  };



  return (
    <div className="min-h-screen bg-light text-dark pt-6 sm:pt-12 md:pt-28 pb-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 pb-6 border-b border-dark/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <a href="/admin" className="text-xs font-mono uppercase tracking-widest text-[#C9A96E] hover:underline flex items-center gap-1">
                ← Admin Dashboard
              </a>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-light text-dark uppercase tracking-tight">Bookings Management</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBookings}
              className="p-2.5 sm:p-3 rounded-full border border-dark/20 hover:bg-dark/5 transition-colors"
              title="Refresh Bookings"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* CONTROLS: SEARCH, SORT, & COUNT */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-[#1C1D20]/5 p-1 rounded-full border border-dark/10 self-start md:self-auto">
            <button
              onClick={() => setSortView("upcoming")}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
                sortView === "upcoming" ? "bg-[#1C1D20] text-white shadow-md" : "text-dark/60 hover:text-dark"
              }`}
            >
              Upcoming Shoots
            </button>
            <button
              onClick={() => setSortView("newest")}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
                sortView === "newest" ? "bg-[#1C1D20] text-white shadow-md" : "text-dark/60 hover:text-dark"
              }`}
            >
              New Inquiries
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by client name, email, phone, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/70 border border-dark/15 rounded-full text-xs font-mono text-dark placeholder:text-dark/40 outline-none focus:border-dark transition-colors"
            />
            <Search size={14} className="absolute left-3.5 top-3 text-dark/40" />
          </form>
        </div>

        {/* MAIN LIST VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Bookings List Table */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {isLoading ? (
              <div className="py-20 text-center text-xs font-mono text-dark/50">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="py-20 text-center bg-white/50 border border-dark/10 rounded-2xl p-8 text-xs font-mono text-dark/50">
                No bookings found for the selected criteria.
              </div>
            ) : (
              bookings.map((b) => (
                <motion.div
                  key={b.id}
                  layout
                  onClick={() => setSelectedBooking(b)}
                  className={`p-4 sm:p-6 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 sm:gap-4 ${
                    selectedBooking?.id === b.id
                      ? "bg-white border-[#1C1D20] shadow-xl ring-1 ring-[#1C1D20]"
                      : "bg-[#FAFAF7] border-dark/10 hover:border-dark/30 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-[#C9A96E] shrink-0" />
                      <span className="text-sm sm:text-base font-medium text-dark truncate">{b.client_name}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-semibold shrink-0">
                      Booked
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono text-dark/70 border-y border-dark/5 py-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={14} className="text-dark/40 shrink-0" />
                      <span>{b.booking_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-dark/40 shrink-0" />
                      <span>{b.start_time.substring(0, 5)} – {b.end_time.substring(0, 5)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera size={14} className="text-dark/40 shrink-0" />
                      <span className="truncate">{b.service}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-dark/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin size={12} className="text-dark/40 shrink-0" />
                      <span className="truncate">{b.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Selected Booking Details Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-[#FAFAF7] border border-dark/15 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
              {selectedBooking ? (
                <>
                  <div className="flex items-center justify-between border-b border-dark/10 pb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-dark/40">Selected Booking</span>
                      <h3 className="text-xl font-light text-dark uppercase">{selectedBooking.client_name}</h3>
                    </div>
                    <button
                      onClick={() => handleDeleteBooking(selectedBooking.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Booking"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 text-xs font-mono">
                    <div>
                      <span className="text-dark/40 text-[10px] block">SERVICE PACKAGE</span>
                      <span className="text-dark font-medium block text-sm">{selectedBooking.service}</span>
                      {selectedBooking.event_type !== selectedBooking.service && (
                        <span className="text-dark/60 block">{selectedBooking.event_type}</span>
                      )}
                    </div>

                    <div>
                      <span className="text-dark/40 text-[10px] block">DATE & TIME</span>
                      <span className="text-dark font-medium block">{selectedBooking.booking_date}</span>
                      <span className="text-dark/60 block">{selectedBooking.start_time} – {selectedBooking.end_time} ({selectedBooking.timezone})</span>
                    </div>

                    <div>
                      <span className="text-dark/40 text-[10px] block">CONTACT DETAILS</span>
                      <span className="text-dark block font-sans text-sm">{selectedBooking.email}</span>
                      <span className="text-dark block">{selectedBooking.phone}</span>
                    </div>

                    <div>
                      <span className="text-dark/40 text-[10px] block">SHOOT LOCATION</span>
                      <span className="text-dark block">{selectedBooking.location}</span>
                    </div>

                    {selectedBooking.message && (
                      <div>
                        <span className="text-dark/40 text-[10px] block">PROJECT VISION & NOTES</span>
                        <p className="text-dark/80 italic font-sans text-xs bg-white/70 p-3 rounded-xl border border-dark/10 mt-1">
                          "{selectedBooking.message}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* DIRECT MANAGEMENT ACTIONS */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-dark/10">
                    <button
                      onClick={() => handleOpenReschedule(selectedBooking)}
                      className="w-full py-2.5 px-4 bg-[#1C1D20] text-white rounded-xl text-xs font-mono hover:bg-black transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 size={14} />
                      <span>Reschedule Booking Date/Time</span>
                    </button>

                    <button
                      onClick={() => handleDeleteBooking(selectedBooking.id)}
                      className="w-full py-2.5 px-4 bg-red-600 text-white rounded-xl text-xs font-mono hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Trash2 size={14} />
                      <span>Delete Booking (Cancel Shoot)</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-20 text-center text-xs font-mono text-dark/40">
                  Select a booking from the list to view full client details and manage.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RESCHEDULE MODAL */}
      <AnimatePresence>
        {rescheduleBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.form
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onSubmit={handleSubmitReschedule}
              className="bg-[#FAFAF7] border border-dark/20 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-dark/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-dark/40">Reschedule Booking</span>
                  <h3 className="text-xl font-light text-dark uppercase">{rescheduleBooking.client_name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setRescheduleBooking(null)}
                  className="p-1 rounded-full hover:bg-dark/10"
                >
                  <XCircle size={20} className="text-dark/40" />
                </button>
              </div>

              {rescheduleError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 rounded-xl text-xs font-mono">
                  {rescheduleError}
                </div>
              )}

              <div className="flex flex-col gap-4 text-xs font-mono">
                <div className="flex flex-col gap-1.5">
                  <label className="text-dark/60 uppercase">New Booking Date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="p-3 bg-white border border-dark/15 rounded-xl text-sm font-mono text-dark outline-none focus:border-dark"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-dark/60 uppercase">New Start Time</label>
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="p-3 bg-white border border-dark/15 rounded-xl text-sm font-mono text-dark outline-none focus:border-dark"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark/10 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setRescheduleBooking(null)}
                  className="px-5 py-2.5 border border-dark/20 text-dark rounded-full hover:bg-dark/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRescheduling}
                  className="px-6 py-2.5 bg-[#1C1D20] text-white rounded-full hover:bg-[#C9A96E] transition-colors disabled:opacity-50"
                >
                  {isRescheduling ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
