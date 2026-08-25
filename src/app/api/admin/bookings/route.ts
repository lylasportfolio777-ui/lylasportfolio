import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";

    let query = supabase
      .from("bookings")
      .select("*");

    if (sort === "upcoming") {
      query = query.order("booking_date", { ascending: true }).order("start_time", { ascending: true });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(
        `client_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,location.ilike.%${search}%`
      );
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error("Error fetching bookings from Supabase:", error);
      return NextResponse.json({ error: "Failed to fetch bookings." }, { status: 500 });
    }

    return NextResponse.json({ bookings: bookings || [] }, { status: 200 });
  } catch (error) {
    console.error("Unhandled error in GET /api/admin/bookings:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
