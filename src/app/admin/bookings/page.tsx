import AdminBookingsClient from "./AdminBookingsClient";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Admin Bookings Dashboard",
  description: "Manage client bookings, reschedule dates, update statuses, and sync Google Calendar.",
  path: "/admin/bookings",
});

export default function AdminBookingsPage() {
  return <AdminBookingsClient />;
}
