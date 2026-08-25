import { z } from "zod";

export const bookingFormSchema = z.object({
  client_name: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(6, "Please enter a valid phone number."),
  service: z.string().min(1, "Please select a service."),
  event_type: z.string().min(1, "Please specify the event type."),
  location: z.string().min(2, "Please enter the shoot location."),
  message: z.string().optional().default(""),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD."),
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid start time format. Use HH:MM."),
  timezone: z.string().default("Asia/Kolkata"),
});

export type BookingFormInput = z.infer<typeof bookingFormSchema>;

export const rescheduleSchema = z.object({
  booking_id: z.string().uuid("Invalid booking ID."),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format."),
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time format."),
});

export const updateStatusSchema = z.object({
  booking_id: z.string().uuid("Invalid booking ID."),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});

export const settingsSchema = z.object({
  slot_duration_minutes: z.number().min(15).max(480),
  buffer_duration_minutes: z.number().min(0).max(180),
  min_advance_hours: z.number().min(0).max(720),
  max_advance_days: z.number().min(1).max(365),
  max_bookings_per_day: z.number().min(1).max(20),
  timezone: z.string(),
  working_hours: z.record(
    z.string(),
    z.object({
      enabled: z.boolean(),
      start: z.string(),
      end: z.string(),
    })
  ),
  services: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      duration: z.number(),
      description: z.string(),
      active: z.boolean(),
    })
  ),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
