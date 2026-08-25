"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Loader2 } from "lucide-react";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Wedding Photography",
    location: "",
    date: "",
    time: "10:00",
    message: "",
  });

  const [servicesList, setServicesList] = useState<Array<{ id: string; name: string; description: string }>>([
    { id: "wedding", name: "Wedding Photography", description: "Full day luxury coverage" },
    { id: "pre-wedding", name: "Pre-Wedding Photography", description: "Outdoor portrait session" },
    { id: "portrait", name: "Portrait Session", description: "Personal portraiture" },
    { id: "couple", name: "Couple Session", description: "Cinematic couple session" },
    { id: "family", name: "Family Photography", description: "Family portraits" },
    { id: "event", name: "Event Photography", description: "Private & commercial event" },
    { id: "custom", name: "Custom Session", description: "Bespoke package" },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<Record<string, unknown> | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.services) {
          const active = data.settings.services.filter((s: { active: boolean }) => s.active);
          if (active.length > 0) {
            setServicesList(active);
            setFormData((prev) => ({ ...prev, service: active[0].name }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 2) newErrors.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (formData.phone.trim().length < 6) newErrors.phone = "Required";
    if (!formData.date) newErrors.date = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          service: formData.service,
          event_type: formData.service,
          location: formData.location.trim() || "TBD",
          message: formData.message.trim(),
          booking_date: formData.date,
          start_time: formData.time,
          timezone: "Asia/Kolkata",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || "Failed to submit inquiry. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setBookingConfirmation(result.booking);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Submission error:", err);
      setServerError("An unexpected network error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const getBorderClass = (fieldName: string) => {
    return errors[fieldName] ? "border-red-500 focus:border-red-500 text-red-500" : "border-[#1C1D20]/20 focus:border-[#1C1D20] text-[#1C1D20]";
  };

  if (bookingConfirmation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#1C1D20]/10 rounded-3xl p-8 md:p-16 flex flex-col gap-8 max-w-3xl shadow-xl mx-auto"
      >
        <div className="flex flex-col gap-6">
          <CheckCircle2 size={48} className="text-[#8C7A5B]" />
          <div>
            <h2 className="text-3xl md:text-5xl font-light text-[#1C1D20] uppercase tracking-tight mb-4">Application Received</h2>
            <p className="text-lg font-light text-[#1C1D20]/60 leading-relaxed max-w-xl">
              Thank you, <strong className="font-semibold text-[#1C1D20]">{bookingConfirmation.client_name as string}</strong>. 
              We carefully review all project inquiries to ensure we can deliver the highest standard of artistic excellence. 
              Our team will be in touch with you within 24 hours to discuss your vision.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1C1D20]/10 flex items-center justify-between">
          <span className="text-sm font-mono text-[#1C1D20]/40 uppercase tracking-widest">Ref: {bookingConfirmation.id as string}</span>
          <button
            type="button"
            onClick={() => {
              setBookingConfirmation(null);
              setFormData({ ...formData, message: "", date: "" });
            }}
            className="text-[#8C7A5B] text-xs font-mono uppercase tracking-widest hover:text-[#1C1D20] transition-colors"
          >
            Submit Another Inquiry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-12 w-full max-w-3xl mx-auto"
      noValidate
    >
      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center justify-between text-xs font-mono"
        >
          <span>{serverError}</span>
          <button type="button" onClick={() => setServerError(null)} className="font-bold hover:underline ml-3">Dismiss</button>
        </motion.div>
      )}

      <div className="flex flex-col gap-12">
        
        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-3 relative">
            <label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-[#1C1D20]/40 font-mono">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`border-b bg-transparent pb-3 pt-2 text-2xl font-light outline-none transition-colors placeholder:text-[#1C1D20]/20 ${getBorderClass("name")}`} placeholder="John Doe" />
          </div>

          <div className="flex flex-col gap-3 relative">
            <label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-[#1C1D20]/40 font-mono">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`border-b bg-transparent pb-3 pt-2 text-2xl font-light outline-none transition-colors placeholder:text-[#1C1D20]/20 ${getBorderClass("email")}`} placeholder="john@example.com" />
          </div>
        </div>

        {/* ROW 2: PHONE & SERVICE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-3 relative">
            <label htmlFor="phone" className="text-xs uppercase tracking-[0.2em] text-[#1C1D20]/40 font-mono">Phone Number</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={`border-b bg-transparent pb-3 pt-2 text-2xl font-light outline-none transition-colors placeholder:text-[#1C1D20]/20 ${getBorderClass("phone")}`} placeholder="+1 000 000 0000" />
          </div>

          <div className="flex flex-col gap-3 relative">
            <label htmlFor="service" className="text-xs uppercase tracking-[0.2em] text-[#1C1D20]/40 font-mono">Service</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="border-b border-[#1C1D20]/20 bg-transparent pb-3 pt-2 text-2xl font-light outline-none focus:border-[#1C1D20] transition-colors appearance-none cursor-pointer text-[#1C1D20]"
            >
              {servicesList.map((s) => (
                <option key={s.id} value={s.name} className="bg-white text-[#1C1D20]">
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ROW 3: DATE & LOCATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-3 relative">
            <label htmlFor="date" className="text-xs uppercase tracking-[0.2em] text-[#1C1D20]/40 font-mono">Preferred Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`border-b bg-transparent pb-3 pt-2 text-2xl font-light outline-none transition-colors placeholder:text-[#1C1D20]/20 ${getBorderClass("date")} [color-scheme:light]`}
            />
          </div>

          <div className="flex flex-col gap-3 relative">
            <label htmlFor="location" className="text-xs uppercase tracking-[0.2em] text-[#1C1D20]/40 font-mono">Location / Venue (Optional)</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="border-b border-[#1C1D20]/20 bg-transparent pb-3 pt-2 text-2xl font-light outline-none focus:border-[#1C1D20] text-[#1C1D20] transition-colors placeholder:text-[#1C1D20]/20"
              placeholder="e.g. Lake Como, Italy"
            />
          </div>
        </div>

        {/* MESSAGE */}
        <div className="flex flex-col gap-3 relative">
          <label htmlFor="message" className="text-xs uppercase tracking-[0.2em] text-[#1C1D20]/40 font-mono">Project Vision & Details</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="border-b border-[#1C1D20]/20 bg-transparent pb-3 pt-2 text-2xl font-light outline-none focus:border-[#1C1D20] text-[#1C1D20] transition-colors resize-none placeholder:text-[#1C1D20]/20"
            placeholder="Tell us about your vision, aesthetics, and expectations for this project..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start mt-8 px-12 py-6 bg-[#1C1D20] text-white rounded-full uppercase tracking-[0.2em] text-xs font-mono font-bold hover:scale-105 active:scale-95 transition-transform duration-300 flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin text-white" />
            <span>Sending Inquiry...</span>
          </>
        ) : (
          <>
            <span>Submit Application</span>
            <Sparkles size={16} className="text-[#8C7A5B]" />
          </>
        )}
      </button>
    </motion.form>
  );
}
