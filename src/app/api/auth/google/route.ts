import { NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google-calendar";

export async function GET() {
  try {
    const authUrl = getGoogleAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error generating Google Auth URL:", error);
    return NextResponse.json(
      { error: "Failed to initiate Google OAuth consent flow." },
      { status: 500 }
    );
  }
}
