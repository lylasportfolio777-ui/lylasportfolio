import { createAdminClient } from "@/utils/supabase/admin";

export interface TimeSlotAvailability {
  start: string; // "09:00"
  end: string;   // "10:00"
  displayStart: string; // "09:00 AM"
  displayEnd: string;   // "10:00 AM"
  available: boolean;
  reason?: string;
}

export interface AvailabilityResult {
  date: string;
  timezone: string;
  isWorkingDay: boolean;
  dayName: string;
  slots: TimeSlotAvailability[];
  settings: {
    slot_duration_minutes: number;
    buffer_duration_minutes: number;
    min_advance_hours: number;
    max_advance_days: number;
    max_bookings_per_day: number;
  };
}

// Convert "HH:MM" or "HH:MM:SS" string to total minutes from midnight
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

// Convert total minutes from midnight to "HH:MM" 24-hour string
function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Convert 24-hour "HH:MM" string to 12-hour "hh:mm AM/PM" string
function format12Hour(timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${String(displayH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

const DEFAULT_SETTINGS = {
  slot_duration_minutes: 60,
  buffer_duration_minutes: 30,
  min_advance_hours: 24,
  max_advance_days: 180,
  max_bookings_per_day: 4,
  timezone: process.env.NEXT_PUBLIC_TIMEZONE || "America/New_York",
  working_hours: {
    monday: { enabled: true, start: "09:00", end: "18:00" },
    tuesday: { enabled: true, start: "09:00", end: "18:00" },
    wednesday: { enabled: true, start: "09:00", end: "18:00" },
    thursday: { enabled: true, start: "09:00", end: "18:00" },
    friday: { enabled: true, start: "09:00", end: "18:00" },
    saturday: { enabled: true, start: "10:00", end: "17:00" },
    sunday: { enabled: false, start: "10:00", end: "17:00" },
  },
};

let cachedSettingsInfo: { data: any; timestamp: number } | null = null;
const SETTINGS_CACHE_TTL = 60 * 1000; // 60 seconds

export function invalidateSettingsCache() {
  cachedSettingsInfo = null;
}

export async function calculateAvailability(dateStr: string): Promise<AvailabilityResult> {
  const supabase = createAdminClient();
  const nowMs = Date.now();

  // 1. Fetch system booking settings (with 60s in-memory caching)
  let settings = cachedSettingsInfo?.data;
  if (!cachedSettingsInfo || nowMs - cachedSettingsInfo.timestamp > SETTINGS_CACHE_TTL) {
    const { data: dbSettings } = await supabase
      .from("booking_settings")
      .select("*")
      .eq("id", 1)
      .single();

    settings = dbSettings || DEFAULT_SETTINGS;
    cachedSettingsInfo = { data: settings, timestamp: nowMs };
  } else {
    settings = cachedSettingsInfo.data;
  }

  const slotDuration = settings.slot_duration_minutes || 60;
  const bufferDuration = settings.buffer_duration_minutes || 30;
  const minAdvanceHours = settings.min_advance_hours ?? 24;
  const maxAdvanceDays = settings.max_advance_days ?? 180;
  const maxBookingsPerDay = settings.max_bookings_per_day ?? 4;
  const timezone = settings.timezone || process.env.NEXT_PUBLIC_TIMEZONE || "America/New_York";
  const workingHoursMap = settings.working_hours || DEFAULT_SETTINGS.working_hours;

  // 2. Parse target date and day of week
  const [year, month, day] = dateStr.split("-").map(Number);
  const targetDateObj = new Date(Date.UTC(year, month - 1, day));
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayName = daysOfWeek[targetDateObj.getUTCDay()];
  const dayConfig = workingHoursMap[dayName] || { enabled: false, start: "09:00", end: "18:00" };

  if (!dayConfig.enabled) {
    return {
      date: dateStr,
      timezone,
      isWorkingDay: false,
      dayName,
      slots: [],
      settings: {
        slot_duration_minutes: slotDuration,
        buffer_duration_minutes: bufferDuration,
        min_advance_hours: minAdvanceHours,
        max_advance_days: maxAdvanceDays,
        max_bookings_per_day: maxBookingsPerDay,
      },
    };
  }

  // 3. Advance Booking Time Rule Checks
  const now = new Date();
  const minAdvanceThreshold = new Date(now.getTime() + minAdvanceHours * 60 * 60 * 1000);
  const maxAdvanceThreshold = new Date(now.getTime() + maxAdvanceDays * 24 * 60 * 60 * 1000);

  // Check if requested date exceeds max advance window
  if (targetDateObj > maxAdvanceThreshold) {
    return {
      date: dateStr,
      timezone,
      isWorkingDay: true,
      dayName,
      slots: [],
      settings: {
        slot_duration_minutes: slotDuration,
        buffer_duration_minutes: bufferDuration,
        min_advance_hours: minAdvanceHours,
        max_advance_days: maxAdvanceDays,
        max_bookings_per_day: maxBookingsPerDay,
      },
    };
  }

  // 4. Fetch Supabase Bookings
  const existingBookingsRes = await supabase
    .from("bookings")
    .select("start_time, end_time, status")
    .eq("booking_date", dateStr)
    .in("status", ["confirmed", "pending"]);

  const existingBookings = existingBookingsRes.data || [];
  const activeBookingsCount = existingBookings.length;
  const isDayFull = activeBookingsCount >= maxBookingsPerDay;

  // Convert existing bookings to minute ranges with buffer
  const bookedRanges = existingBookings.map((b) => {
    const startMin = timeToMinutes(b.start_time);
    const endMin = timeToMinutes(b.end_time);
    return {
      start: startMin - bufferDuration,
      end: endMin + bufferDuration,
    };
  });

  // 5. Generate Potential Slots
  const workStartMin = timeToMinutes(dayConfig.start);
  const workEndMin = timeToMinutes(dayConfig.end);
  const slots: TimeSlotAvailability[] = [];

  // Slot step interval (e.g., 30 mins or slotDuration)
  const slotStep = 30;

  for (let sMin = workStartMin; sMin + slotDuration <= workEndMin; sMin += slotStep) {
    const eMin = sMin + slotDuration;
    const slotStartStr = minutesToTime(sMin);
    const slotEndStr = minutesToTime(eMin);

    // Create Date Object for exact slot start to check advance time
    const slotDateTime = new Date(`${dateStr}T${slotStartStr}:00`);

    let isAvailable = true;
    let unavailableReason: string | undefined;

    if (isDayFull) {
      isAvailable = false;
      unavailableReason = "Maximum daily bookings reached";
    } else if (slotDateTime < minAdvanceThreshold) {
      isAvailable = false;
      unavailableReason = `Requires ${minAdvanceHours} hours advance notice`;
    } else {
      // Check overlap with existing Supabase bookings
      const hasSupabaseConflict = bookedRanges.some(
        (r) => Math.max(sMin, r.start) < Math.min(eMin, r.end)
      );

      if (hasSupabaseConflict) {
        isAvailable = false;
        unavailableReason = "Slot already booked";
      }
    }

    slots.push({
      start: slotStartStr,
      end: slotEndStr,
      displayStart: format12Hour(slotStartStr),
      displayEnd: format12Hour(slotEndStr),
      available: isAvailable,
      reason: unavailableReason,
    });
  }

  return {
    date: dateStr,
    timezone,
    isWorkingDay: true,
    dayName,
    slots,
    settings: {
      slot_duration_minutes: slotDuration,
      buffer_duration_minutes: bufferDuration,
      min_advance_hours: minAdvanceHours,
      max_advance_days: maxAdvanceDays,
      max_bookings_per_day: maxBookingsPerDay,
    },
  };
}

export async function checkDoubleBookingConflict(
  bookingDate: string,
  startTime: string,
  endTime: string,
  bufferMinutes: number = 30
): Promise<boolean> {
  const supabase = createAdminClient();
  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);

  // Fetch all existing bookings for that date
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("id, start_time, end_time")
    .eq("booking_date", bookingDate)
    .in("status", ["confirmed", "pending"]);

  if (error || !bookings) return false;

  for (const b of bookings) {
    const bStart = timeToMinutes(b.start_time) - bufferMinutes;
    const bEnd = timeToMinutes(b.end_time) + bufferMinutes;

    // Overlap check
    if (Math.max(startMin, bStart) < Math.min(endMin, bEnd)) {
      return true; // Conflict exists!
    }
  }

  return false; // No conflict
}
