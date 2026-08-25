import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { settingsSchema } from "@/lib/validation/booking";
import { invalidateSettingsCache } from "@/lib/availability";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: dbSettings } = await supabase
      .from("booking_settings")
      .select("*")
      .eq("id", 1)
      .single();

    return NextResponse.json(
      {
        settings: dbSettings || {},
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/admin/settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = settingsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const input = validationResult.data;

    const { data: updatedSettings, error } = await supabase
      .from("booking_settings")
      .upsert(
        {
          id: 1,
          slot_duration_minutes: input.slot_duration_minutes,
          buffer_duration_minutes: input.buffer_duration_minutes,
          min_advance_hours: input.min_advance_hours,
          max_advance_days: input.max_advance_days,
          max_bookings_per_day: input.max_bookings_per_day,
          timezone: input.timezone,
          working_hours: input.working_hours,
          services: input.services,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Error updating settings in Supabase:", error);
      return NextResponse.json({ error: "Failed to save settings." }, { status: 500 });
    }

    invalidateSettingsCache();

    return NextResponse.json(
      { message: "Settings saved successfully.", settings: updatedSettings },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/admin/settings:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
