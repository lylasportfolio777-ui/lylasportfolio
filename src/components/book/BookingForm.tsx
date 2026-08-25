"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  Clock, 
  Calendar as CalendarIcon, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Camera
} from "lucide-react";

interface Slot {
  start: string;
  end: string;
  displayStart: string;
  displayEnd: string;
  available: boolean;
  reason?: string;
}

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  duration?: number;
}

export default function BookingForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Wedding Photography",
    location: "",
    date: "",
    time: "",
    message: "",
  });

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [servicesList, setServicesList] = useState<ServiceItem[]>([
    { id: "wedding", name: "Wedding Photography", description: "Full day luxury coverage & high-res edit", duration: 480 },
    { id: "pre-wedding", name: "Pre-Wedding Photography", description: "Outdoor portrait session & cinematic styling", duration: 180 },
    { id: "portrait", name: "Portrait Session", description: "Personal portraiture & studio lighting", duration: 90 },
    { id: "couple", name: "Couple Session", description: "Cinematic story session in iconic locations", duration: 120 },
    { id: "family", name: "Family Photography", description: "Heirloom family portraits & group shots", duration: 120 },
    { id: "event", name: "Event Photography", description: "Private galas & luxury corporate events", duration: 240 },
    { id: "custom", name: "Custom Session", description: "Bespoke creative direction", duration: 120 },
  ]);

  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [isWorkingDay, setIsWorkingDay] = useState(true);
  const [dayName, setDayName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<Record<string, unknown> | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Fetch Services List from Admin Settings
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

  // Fetch Available Time Slots whenever Date changes
  useEffect(() => {
    if (!formData.date) {
      setAvailableSlots([]);
      return;
    }

    setIsFetchingSlots(true);
    fetch(`/api/availability?date=${formData.date}`)
      .then((res) => res.json())
      .then((data) => {
        setIsFetchingSlots(false);
        if (data.slots) {
          setAvailableSlots(data.slots);
          setIsWorkingDay(data.isWorkingDay);
          setDayName(data.dayName);

          const openSlot = data.slots.find((s: Slot) => s.available);
          if (openSlot) {
            setFormData((prev) => ({ ...prev, time: openSlot.start }));
            setErrors((prev) => ({ ...prev, time: "" }));
          } else {
            setFormData((prev) => ({ ...prev, time: "" }));
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch slots:", err);
        setIsFetchingSlots(false);
      });
  }, [formData.date]);

  // Validation Logic
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Please enter a valid email address (e.g. name@domain.com)";
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (value.replace(/\D/g, "").length < 7) return "Please enter a valid contact number (min 7 digits)";
        return "";
      case "date":
        if (!value) return "Please select a shoot date";
        return "";
      case "time":
        if (!value) return "Please select an available time slot";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    const errorMsg = validateField(fieldName, formData[fieldName as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (touchedFields[name]) {
      const errorMsg = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const validateStep1 = () => {
    const nameErr = validateField("name", formData.name);
    const emailErr = validateField("email", formData.email);
    const phoneErr = validateField("phone", formData.phone);

    const newErrors = { name: nameErr, email: emailErr, phone: phoneErr };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    setTouchedFields((prev) => ({ ...prev, name: true, email: true, phone: true }));

    return !nameErr && !emailErr && !phoneErr;
  };

  const validateStep2 = () => {
    const dateErr = validateField("date", formData.date);
    const timeErr = validateField("time", formData.time);

    const newErrors = { date: dateErr, time: timeErr };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    setTouchedFields((prev) => ({ ...prev, date: true, time: true }));

    return !dateErr && !timeErr && isWorkingDay;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateStep1() || !validateStep2()) {
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
          timezone: process.env.NEXT_PUBLIC_TIMEZONE || "America/New_York",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || "Failed to submit booking. Please try another time slot.");
        setIsSubmitting(false);
        return;
      }

      setBookingConfirmation(result.booking);
      setIsSubmitting(false);

      // --- WHATSAPP FORWARDING LOGIC ---
      // Replace with actual admin number in format: 1234567890 (country code + number, no + or spaces)
      const adminWhatsApp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "1234567890"; 
      
      const waMessage = `*New Booking Request!* 📸
*Name:* ${formData.name.trim()}
*Service:* ${formData.service}
*Date:* ${formData.date}
*Time:* ${formData.time}
*Location:* ${formData.location.trim() || "TBD"}
*Phone:* ${formData.phone.trim()}
*Email:* ${formData.email.trim()}${formData.message.trim() ? `\n*Notes:* ${formData.message.trim()}` : ""}`;

      const waUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, "_blank");

    } catch (err) {
      console.error("Submission error:", err);
      setServerError("An unexpected network error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const getInputClass = (fieldName: string) => {
    const hasError = touchedFields[fieldName] && errors[fieldName];
    const isValid = touchedFields[fieldName] && !errors[fieldName] && formData[fieldName as keyof typeof formData];

    if (hasError) return "border-red-500 text-red-600 focus:border-red-500 bg-red-500/5";
    if (isValid) return "border-emerald-600 text-[#1C1D20] focus:border-emerald-600 bg-emerald-500/5";
    return "border-[#1C1D20]/20 text-[#1C1D20] focus:border-[#1C1D20]";
  };

  const todayStr = new Date().toISOString().split("T")[0];

  // Quick Date Helpers
  const setQuickDate = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    const dateStr = d.toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, date: dateStr }));
    if (errors.date) setErrors((prev) => ({ ...prev, date: "" }));
  };

  if (bookingConfirmation) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-[#1C1D20]/15 rounded-3xl p-6 sm:p-12 md:p-16 flex flex-col gap-8 max-w-3xl shadow-2xl mx-auto text-[#1C1D20]"
      >
        <div className="flex flex-col gap-6 items-start">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#8C7A5B] block mb-2">Reservation Confirmed</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-tight mb-4">Commission Booked</h2>
            <p className="text-base sm:text-lg font-light text-[#1C1D20]/70 leading-relaxed max-w-xl">
              Thank you, <strong className="font-semibold text-[#1C1D20]">{bookingConfirmation.client_name as string}</strong>. 
              Your session has been reserved for <strong className="text-[#1C1D20]">{bookingConfirmation.booking_date as string}</strong> at <strong className="text-[#1C1D20]">{bookingConfirmation.start_time as string}</strong>.
            </p>
          </div>
        </div>

        {/* Confirmation Details Card */}
        <div className="bg-[#FAFAF7] border border-[#1C1D20]/10 rounded-2xl p-6 flex flex-col gap-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-[#1C1D20]/10 pb-3">
            <span className="text-[#1C1D20]/50 uppercase">Service</span>
            <span className="font-semibold text-sm text-[#1C1D20]">{bookingConfirmation.service as string}</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#1C1D20]/10 pb-3">
            <span className="text-[#1C1D20]/50 uppercase">Date & Time</span>
            <span className="font-semibold text-[#1C1D20]">{bookingConfirmation.booking_date as string} @ {bookingConfirmation.start_time as string}</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#1C1D20]/10 pb-3">
            <span className="text-[#1C1D20]/50 uppercase">Location</span>
            <span className="font-semibold text-[#1C1D20]">{bookingConfirmation.location as string}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#1C1D20]/50 uppercase">Contact Email</span>
            <span className="font-semibold text-[#1C1D20]">{bookingConfirmation.email as string}</span>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1C1D20]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-xs font-mono text-[#1C1D20]/40 uppercase tracking-widest">Ref: {bookingConfirmation.id as string}</span>
          <button
            type="button"
            onClick={() => {
              setBookingConfirmation(null);
              setStep(1);
              setFormData({ name: "", email: "", phone: "", service: servicesList[0]?.name || "Wedding Photography", location: "", date: "", time: "", message: "" });
              setTouchedFields({});
            }}
            className="px-6 py-3 bg-[#1C1D20] text-white rounded-full text-xs font-mono uppercase tracking-widest hover:bg-black transition-colors"
          >
            Book Another Session
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
      {/* STEP PROGRESS INDICATOR */}
      <div className="flex items-center justify-between border-b border-[#1C1D20]/15 pb-6">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors ${step >= 1 ? "bg-[#1C1D20] text-white" : "bg-[#1C1D20]/10 text-[#1C1D20]/40"}`}>
            {step > 1 ? <Check size={14} /> : "1"}
          </div>
          <span className={`text-xs uppercase font-mono tracking-widest hidden sm:inline ${step === 1 ? "text-[#1C1D20] font-bold" : "text-[#1C1D20]/40"}`}>
            Contact
          </span>
        </div>

        <div className="w-12 sm:w-20 h-px bg-[#1C1D20]/15" />

        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors ${step >= 2 ? "bg-[#1C1D20] text-white" : "bg-[#1C1D20]/10 text-[#1C1D20]/40"}`}>
            {step > 2 ? <Check size={14} /> : "2"}
          </div>
          <span className={`text-xs uppercase font-mono tracking-widest hidden sm:inline ${step === 2 ? "text-[#1C1D20] font-bold" : "text-[#1C1D20]/40"}`}>
            Schedule
          </span>
        </div>

        <div className="w-12 sm:w-20 h-px bg-[#1C1D20]/15" />

        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors ${step === 3 ? "bg-[#1C1D20] text-white" : "bg-[#1C1D20]/10 text-[#1C1D20]/40"}`}>
            3
          </div>
          <span className={`text-xs uppercase font-mono tracking-widest hidden sm:inline ${step === 3 ? "text-[#1C1D20] font-bold" : "text-[#1C1D20]/40"}`}>
            Review
          </span>
        </div>
      </div>

      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/30 text-red-800 rounded-2xl flex items-center justify-between text-xs font-mono"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{serverError}</span>
          </div>
          <button type="button" onClick={() => setServerError(null)} className="font-bold hover:underline ml-3">Dismiss</button>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <AnimatePresence mode="wait">
          {/* STEP 1: CONTACT & CLIENT DETAILS */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6 sm:gap-10"
            >
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#8C7A5B] block mb-1">Step 1 of 3</span>
                <h3 className="text-2xl sm:text-3xl font-light uppercase text-[#1C1D20] tracking-tight">Client & Contact Details</h3>
              </div>

              <div className="flex flex-col gap-6 sm:gap-8">
                {/* FULL NAME */}
                <div className="flex flex-col gap-2 relative">
                  <label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-[#1C1D20]/50 font-mono flex items-center gap-1.5">
                    <User size={13} className="text-[#8C7A5B]" /> Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("name")}
                    className={`border-b bg-transparent pb-3 pt-2 text-xl sm:text-2xl font-light outline-none transition-all placeholder:text-[#1C1D20]/20 ${getInputClass("name")}`}
                    placeholder="Alex Morgan"
                  />
                  {touchedFields.name && errors.name && (
                    <span className="text-xs text-red-500 font-mono mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.name}
                    </span>
                  )}
                </div>

                {/* EMAIL ADDRESS */}
                <div className="flex flex-col gap-2 relative">
                  <label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-[#1C1D20]/50 font-mono flex items-center gap-1.5">
                    <Mail size={13} className="text-[#8C7A5B]" /> Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    className={`border-b bg-transparent pb-3 pt-2 text-xl sm:text-2xl font-light outline-none transition-all placeholder:text-[#1C1D20]/20 ${getInputClass("email")}`}
                    placeholder="alex@example.com"
                  />
                  {touchedFields.email && errors.email && (
                    <span className="text-xs text-red-500 font-mono mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.email}
                    </span>
                  )}
                </div>

                {/* PHONE & LOCATION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2 relative">
                    <label htmlFor="phone" className="text-xs uppercase tracking-[0.2em] text-[#1C1D20]/50 font-mono flex items-center gap-1.5">
                      <Phone size={13} className="text-[#8C7A5B]" /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur("phone")}
                      className={`border-b bg-transparent pb-3 pt-2 text-xl font-light outline-none transition-all placeholder:text-[#1C1D20]/20 ${getInputClass("phone")}`}
                      placeholder="+1 (555) 000-0000"
                    />
                    {touchedFields.phone && errors.phone && (
                      <span className="text-xs text-red-500 font-mono mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.phone}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 relative">
                    <label htmlFor="location" className="text-xs uppercase tracking-[0.2em] text-[#1C1D20]/50 font-mono flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#8C7A5B]" /> Venue / Location (Optional)
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="border-b border-[#1C1D20]/20 bg-transparent pb-3 pt-2 text-xl font-light outline-none focus:border-[#1C1D20] text-[#1C1D20] transition-colors placeholder:text-[#1C1D20]/20"
                      placeholder="e.g. Studio, Lake Como, Paris"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 sm:px-10 py-4 sm:py-5 bg-[#1C1D20] text-white rounded-full text-xs font-mono uppercase tracking-widest font-bold hover:scale-105 transition-transform flex items-center gap-3"
                >
                  <span>Continue to Schedule</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SERVICE & TIME SLOTS */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6 sm:gap-10"
            >
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#8C7A5B] block mb-1">Step 2 of 3</span>
                <h3 className="text-2xl sm:text-3xl font-light uppercase text-[#1C1D20] tracking-tight">Service & Session Date</h3>
              </div>

              <div className="flex flex-col gap-6 sm:gap-8">
                {/* SERVICE SELECTION CARDS */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#1C1D20]/50 font-mono flex items-center gap-1.5">
                    <Camera size={13} className="text-[#8C7A5B]" /> Select Photography Service *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {servicesList.map((s) => {
                      const isSelected = formData.service === s.name;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setFormData((prev) => ({ ...prev, service: s.name }))}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                            isSelected
                              ? "bg-[#1C1D20] text-white border-[#1C1D20] shadow-xl ring-2 ring-[#8C7A5B]"
                              : "bg-white text-[#1C1D20] border-[#1C1D20]/15 hover:border-[#1C1D20] hover:bg-[#FAFAF7]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-semibold">{s.name}</span>
                            {isSelected && <Check size={16} className="text-[#8C7A5B]" />}
                          </div>
                          <p className={`text-xs font-mono line-clamp-2 ${isSelected ? "text-white/70" : "text-[#1C1D20]/60"}`}>
                            {s.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DATE SELECTION & PRESETS */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="date" className="text-xs uppercase tracking-[0.2em] text-[#1C1D20]/50 font-mono flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><CalendarIcon size={13} className="text-[#8C7A5B]" /> Preferred Session Date *</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      min={todayStr}
                      value={formData.date}
                      onChange={handleChange}
                      onBlur={() => handleBlur("date")}
                      className={`border-b bg-transparent pb-3 pt-2 text-xl sm:text-2xl font-light outline-none transition-all ${getInputClass("date")} [color-scheme:light]`}
                    />
                    {touchedFields.date && errors.date && (
                      <span className="text-xs text-red-500 font-mono mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.date}
                      </span>
                    )}
                  </div>

                  {/* QUICK DATE PRESETS */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-[#1C1D20]/40 uppercase tracking-wider">Quick Select:</span>
                    <button
                      type="button"
                      onClick={() => setQuickDate(1)}
                      className="px-3 py-1 bg-white border border-[#1C1D20]/15 rounded-full text-xs font-mono hover:bg-[#1C1D20] hover:text-white transition-colors"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(3)}
                      className="px-3 py-1 bg-white border border-[#1C1D20]/15 rounded-full text-xs font-mono hover:bg-[#1C1D20] hover:text-white transition-colors"
                    >
                      In 3 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(7)}
                      className="px-3 py-1 bg-white border border-[#1C1D20]/15 rounded-full text-xs font-mono hover:bg-[#1C1D20] hover:text-white transition-colors"
                    >
                      Next Week
                    </button>
                  </div>
                </div>

                {/* TIME SLOTS SELECTOR */}
                {formData.date && (
                  <div className="flex flex-col gap-4 p-5 sm:p-6 bg-[#FAFAF7] border border-[#1C1D20]/15 rounded-2xl sm:rounded-3xl shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#1C1D20]/10 pb-3">
                      <span className="text-xs uppercase tracking-[0.2em] text-[#1C1D20] font-mono font-semibold flex items-center gap-2">
                        <Clock size={15} className="text-[#8C7A5B]" /> Available Time Slots ({formData.date})
                      </span>
                      {isFetchingSlots && (
                        <span className="text-xs font-mono text-[#1C1D20]/60 flex items-center gap-1.5">
                          <Loader2 size={13} className="animate-spin text-[#8C7A5B]" /> Checking...
                        </span>
                      )}
                    </div>

                    {!isWorkingDay && !isFetchingSlots ? (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-mono text-amber-900">
                        Photographer is unavailable or on a scheduled day off on <strong className="uppercase">{dayName}</strong>. Please select another date.
                      </div>
                    ) : availableSlots.length === 0 && !isFetchingSlots ? (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-mono text-red-800">
                        No available time slots found for this date. Maximum daily bookings reached.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
                        {availableSlots.map((slot) => {
                          const isSelected = formData.time === slot.start;
                          return (
                            <button
                              key={slot.start}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, time: slot.start }));
                                setErrors((prev) => ({ ...prev, time: "" }));
                              }}
                              className={`p-3 rounded-xl border text-xs font-mono transition-all flex flex-col items-center gap-1 ${
                                isSelected
                                  ? "bg-[#1C1D20] text-white border-[#1C1D20] shadow-lg ring-2 ring-[#8C7A5B]"
                                  : slot.available
                                  ? "bg-white text-[#1C1D20] border-[#1C1D20]/15 hover:border-[#1C1D20] hover:bg-[#FAFAF7]"
                                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                              }`}
                              title={slot.reason || (slot.available ? "Available" : "Booked")}
                            >
                              <span className="font-semibold">{slot.displayStart}</span>
                              <span className="text-[10px] opacity-75">{slot.displayEnd}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {touchedFields.time && errors.time && (
                      <span className="text-xs text-red-500 font-mono mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.time}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 sm:px-6 py-3 sm:py-4 border border-[#1C1D20]/20 text-[#1C1D20] rounded-full text-xs font-mono uppercase tracking-widest hover:bg-[#1C1D20] hover:text-white transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} className="hidden sm:block" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 sm:px-10 py-4 sm:py-5 bg-[#1C1D20] text-white rounded-full text-xs font-mono uppercase tracking-widest font-bold hover:scale-105 transition-transform flex items-center gap-2 sm:gap-3"
                >
                  <span className="hidden sm:inline">Review Application</span>
                  <span className="sm:hidden">Review</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: REVIEW & CONFIRMATION */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6 sm:gap-8"
            >
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#8C7A5B] block mb-1">Step 3 of 3</span>
                <h3 className="text-2xl sm:text-3xl font-light uppercase text-[#1C1D20] tracking-tight">Review & Confirm Inquiry</h3>
              </div>

              {/* SUMMARY CARD */}
              <div className="bg-[#FAFAF7] border border-[#1C1D20]/15 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-lg">
                <div className="flex items-center justify-between border-b border-[#1C1D20]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={24} className="text-[#8C7A5B]" />
                    <span className="font-mono text-xs uppercase tracking-widest text-[#1C1D20]/60">Booking Summary</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-mono text-[#8C7A5B] hover:underline"
                  >
                    Edit Details
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
                  <div>
                    <span className="text-[#1C1D20]/40 uppercase block mb-1">Client Name</span>
                    <span className="text-[#1C1D20] font-semibold text-sm">{formData.name}</span>
                  </div>

                  <div>
                    <span className="text-[#1C1D20]/40 uppercase block mb-1">Contact Email</span>
                    <span className="text-[#1C1D20] font-semibold text-sm">{formData.email}</span>
                  </div>

                  <div>
                    <span className="text-[#1C1D20]/40 uppercase block mb-1">Phone Number</span>
                    <span className="text-[#1C1D20] font-semibold text-sm">{formData.phone}</span>
                  </div>

                  <div>
                    <span className="text-[#1C1D20]/40 uppercase block mb-1">Selected Service</span>
                    <span className="text-[#8C7A5B] font-semibold text-sm">{formData.service}</span>
                  </div>

                  <div>
                    <span className="text-[#1C1D20]/40 uppercase block mb-1">Scheduled Date</span>
                    <span className="text-[#1C1D20] font-semibold text-sm">{formData.date}</span>
                  </div>

                  <div>
                    <span className="text-[#1C1D20]/40 uppercase block mb-1">Time Slot</span>
                    <span className="text-[#1C1D20] font-semibold text-sm">{formData.time}</span>
                  </div>
                </div>

                {formData.location && (
                  <div className="pt-4 border-t border-[#1C1D20]/10 text-xs font-mono">
                    <span className="text-[#1C1D20]/40 uppercase block mb-1">Location / Venue</span>
                    <span className="text-[#1C1D20]">{formData.location}</span>
                  </div>
                )}
              </div>

              {/* MESSAGE / VISION DETAILS */}
              <div className="flex flex-col gap-2 relative">
                <label htmlFor="message" className="text-xs uppercase tracking-[0.2em] text-[#1C1D20]/50 font-mono flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><MessageSquare size={13} className="text-[#8C7A5B]" /> Project Vision & Notes (Optional)</span>
                  <span className="text-[10px] text-[#1C1D20]/40">{formData.message.length} / 500</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  maxLength={500}
                  value={formData.message}
                  onChange={handleChange}
                  className="border-b border-[#1C1D20]/20 bg-transparent pb-3 pt-2 text-lg font-light outline-none focus:border-[#1C1D20] text-[#1C1D20] transition-colors resize-none placeholder:text-[#1C1D20]/20"
                  placeholder="Share any special lighting preferences, aesthetic moodboards, or schedule constraints..."
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 sm:px-6 py-3 sm:py-4 border border-[#1C1D20]/20 text-[#1C1D20] rounded-full text-xs font-mono uppercase tracking-widest hover:bg-[#1C1D20] hover:text-white transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} className="hidden sm:block" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || Boolean(formData.date && !formData.time && availableSlots.length > 0)}
                  className="px-6 sm:px-12 py-4 sm:py-5 bg-[#1C1D20] text-white rounded-full uppercase tracking-[0.2em] text-[10px] sm:text-xs font-mono font-bold hover:scale-105 active:scale-95 transition-transform duration-300 flex items-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-white sm:h-4 sm:w-4" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Confirm & Send Inquiry</span>
                      <span className="sm:hidden">Confirm Booking</span>
                      <Sparkles size={14} className="text-[#8C7A5B] sm:h-4 sm:w-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
