import { NextRequest, NextResponse } from "next/server";
import { calculateAvailability } from "@/lib/availability";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Invalid or missing date parameter. Use format YYYY-MM-DD." },
      { status: 400 }
    );
  }

  try {
    const result = await calculateAvailability(date);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to calculate server availability." },
      { status: 500 }
    );
  }
}
