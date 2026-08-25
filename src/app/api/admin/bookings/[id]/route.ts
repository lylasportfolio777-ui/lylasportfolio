import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { checkDoubleBookingConflict } from "@/lib/availability";
import {
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
} from "@/lib/google-calendar";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = createAdminClient();

    // Fetch existing booking
    const { data: existingBooking, error: fetchErr } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !existingBooking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const action = body.action || "update_status";

    if (action === "reschedule") {
      const { booking_date, start_time } = body;
      if (!booking_date || !start_time) {
        return NextResponse.json(
          { error: "Date and start_time are required for rescheduling." },
          { status: 400 }
        );
      }

      // Calculate duration from existing booking
      const [oldStartH, oldStartM] = existingBooking.start_time.split(":").map(Number);
      const [oldEndH, oldEndM] = existingBooking.end_time.split(":").map(Number);
      const durationMinutes = (oldEndH * 60 + oldEndM) - (oldStartH * 60 + oldStartM);

      const [newStartH, newStartM] = start_time.split(":").map(Number);
      const newEndTotal = newStartH * 60 + newStartM + (durationMinutes > 0 ? durationMinutes : 60);
      const newEndH = Math.floor(newEndTotal / 60);
      const newEndM = newEndTotal % 60;

      const newStartTimeStr = `${start_time.substring(0, 5)}:00`;
      const newEndTimeStr = `${String(newEndH).padStart(2, "0")}:${String(newEndM).padStart(2, "0")}:00`;

      // Check conflict
      const isConflict = await checkDoubleBookingConflict(
        booking_date,
        newStartTimeStr,
        newEndTimeStr
      );

      if (isConflict) {
        return NextResponse.json(
          { error: "The new time slot has a conflict with an existing booking." },
          { status: 409 }
        );
      }

      // Update Supabase
      const { data: updatedBooking, error: updateErr } = await supabase
        .from("bookings")
        .update({
          booking_date,
          start_time: newStartTimeStr,
          end_time: newEndTimeStr,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (updateErr || !updatedBooking) {
        return NextResponse.json({ error: "Failed to reschedule booking." }, { status: 500 });
      }

      // Sync existing Google Calendar event if present
      if (updatedBooking.google_event_id) {
        await updateGoogleCalendarEvent(updatedBooking.google_event_id, {
          id: updatedBooking.id,
          client_name: updatedBooking.client_name,
          email: updatedBooking.email,
          phone: updatedBooking.phone,
          service: updatedBooking.service,
          event_type: updatedBooking.event_type,
          location: updatedBooking.location,
          message: updatedBooking.message,
          booking_date: updatedBooking.booking_date,
          start_time: updatedBooking.start_time,
          end_time: updatedBooking.end_time,
          timezone: updatedBooking.timezone,
        });
      }

      return NextResponse.json(
        { message: "Booking rescheduled successfully.", booking: updatedBooking },
        { status: 200 }
      );
    } else {
      // Update Status (confirmed, cancelled, completed, pending)
      const { status } = body;
      if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
        return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
      }

      const { data: updatedBooking, error: updateErr } = await supabase
        .from("bookings")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (updateErr || !updatedBooking) {
        return NextResponse.json({ error: "Failed to update booking status." }, { status: 500 });
      }

      // If status is changed to cancelled, delete corresponding Google Calendar event
      if (status === "cancelled" && existingBooking.google_event_id) {
        await deleteGoogleCalendarEvent(existingBooking.google_event_id);
      }

      return NextResponse.json(
        { message: `Booking status updated to ${status}.`, booking: updatedBooking },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error in PATCH /api/admin/bookings/[id]:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("google_event_id")
      .eq("id", id)
      .single();

    if (existingBooking?.google_event_id) {
      await deleteGoogleCalendarEvent(existingBooking.google_event_id);
    }

    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: "Failed to delete booking." }, { status: 500 });
    }

    return NextResponse.json({ message: "Booking deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/admin/bookings/[id]:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
