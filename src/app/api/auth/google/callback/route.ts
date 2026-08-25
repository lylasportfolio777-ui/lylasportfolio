import { NextRequest, NextResponse } from "next/server";
import { getOAuth2Client, saveGoogleTokens } from "@/lib/google-calendar";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/admin/booking-settings?error=missing_code", request.url)
    );
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch photographer's email address
    let email = "Connected Account";
    try {
      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();
      if (userInfo.data.email) {
        email = userInfo.data.email;
      }
    } catch {
      // Ignore if userinfo API fails
    }

    // Save tokens in Supabase table
    await saveGoogleTokens(
      {
        refresh_token: tokens.refresh_token,
        access_token: tokens.access_token,
        expiry_date: tokens.expiry_date,
      },
      email
    );

    return NextResponse.redirect(
      new URL("/admin/booking-settings?connected=true", request.url)
    );
  } catch (error) {
    console.error("Error exchanging Google OAuth code:", error);
    return NextResponse.redirect(
      new URL("/admin/booking-settings?error=oauth_failed", request.url)
    );
  }
}
