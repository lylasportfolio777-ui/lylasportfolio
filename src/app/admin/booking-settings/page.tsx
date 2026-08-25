import AdminBookingSettingsClient from "./AdminBookingSettingsClient";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Booking System Settings",
  description: "Configure working hours, slot durations, buffer times, advance booking rules, services, and Google Calendar integration.",
  path: "/admin/booking-settings",
});

export default function AdminBookingSettingsPage() {
  return <AdminBookingSettingsClient />;
}
