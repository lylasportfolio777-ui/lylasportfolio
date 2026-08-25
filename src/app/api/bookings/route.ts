import { NextRequest, NextResponse } from "next/server";
import { bookingFormSchema } from "@/lib/validation/booking";
import { createAdminClient } from "@/utils/supabase/admin";
import { checkDoubleBookingConflict } from "@/lib/availability";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod Validation
    const validationResult = bookingFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const input = validationResult.data;
    const supabase = createAdminClient();

    // 2. Fetch slot duration settings
    const { data: dbSettings } = await supabase
      .from("booking_settings")
      .select("slot_duration_minutes, buffer_duration_minutes, services")
      .eq("id", 1)
      .single();

    const servicesList = (dbSettings?.services as Array<{ name: string; duration: number }>) || [];
    const matchedService = servicesList.find((s) => s.name === input.service);
    const durationMinutes = matchedService?.duration || dbSettings?.slot_duration_minutes || 60;
    const bufferMinutes = dbSettings?.buffer_duration_minutes || 30;

    // Calculate End Time
    const [startH, startM] = input.start_time.split(":").map(Number);
    const endTotalMinutes = startH * 60 + startM + durationMinutes;
    const endH = Math.floor(endTotalMinutes / 60);
    const endM = endTotalMinutes % 60;
    const endTimeStr = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00`;
    const startTimeStr = `${input.start_time.substring(0, 5)}:00`;

    // 3. Double Booking Conflict Check (Server-side Race Condition Protection)
    const isConflict = await checkDoubleBookingConflict(
      input.booking_date,
      startTimeStr,
      endTimeStr,
      bufferMinutes
    );

    if (isConflict) {
      return NextResponse.json(
        {
          error: "Sorry, this time was just booked by another client. Please select another time.",
          code: "TIME_SLOT_TAKEN",
        },
        { status: 409 }
      );
    }

    // 4. Save Booking in Supabase (Primary Source of Truth)
    const newBookingData = {
      client_name: input.client_name,
      email: input.email,
      phone: input.phone,
      service: input.service,
      event_type: input.event_type,
      location: input.location,
      message: input.message || "",
      booking_date: input.booking_date,
      start_time: startTimeStr,
      end_time: endTimeStr,
      timezone: input.timezone || process.env.NEXT_PUBLIC_TIMEZONE || "America/New_York",
      status: "confirmed",
    };

    const { data: createdBooking, error: insertError } = await supabase
      .from("bookings")
      .insert(newBookingData)
      .select()
      .single();

    if (insertError || !createdBooking) {
      console.error("Failed to insert booking into Supabase:", insertError);
      return NextResponse.json(
        { error: "Failed to process booking request. Please try again." },
        { status: 500 }
      );
    }

    // 5. Return Booking Confirmation Response
    return NextResponse.json(
      {
        message: "Booking confirmed successfully",
        booking: createdBooking,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Unhandled error in POST /api/bookings:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your booking." },
      { status: 500 }
    );
  }
}
