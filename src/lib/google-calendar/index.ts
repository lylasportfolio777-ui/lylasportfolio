import { google } from "googleapis";
import { createAdminClient } from "@/utils/supabase/admin";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback";
const DEFAULT_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
}

export function getGoogleAuthUrl() {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: true,
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
}

export async function saveGoogleTokens(tokens: {
  refresh_token?: string | null;
  access_token?: string | null;
  expiry_date?: number | null;
}, connectedEmail?: string) {
  const supabase = createAdminClient();

  // Fetch existing token row from Supabase
  const { data: existing } = await supabase
    .from("google_oauth_tokens")
    .select("*")
    .eq("id", 1)
    .single();

  const activeRefreshToken = tokens.refresh_token || existing?.refresh_token;

  // If there is no refresh_token stored or provided yet, skip saving auto-refreshed access tokens
  if (!activeRefreshToken) {
    console.log("[Google OAuth] Photographer has not connected Google Calendar yet. Skipping token auto-save.");
    return;
  }

  const updateData: Record<string, unknown> = {
    id: 1,
    refresh_token: activeRefreshToken,
    updated_at: new Date().toISOString(),
  };

  if (tokens.access_token) updateData.access_token = tokens.access_token;
  else if (existing?.access_token) updateData.access_token = existing.access_token;

  if (tokens.expiry_date) updateData.expiry_date = tokens.expiry_date;
  else if (existing?.expiry_date) updateData.expiry_date = existing.expiry_date;

  const emailToSave = connectedEmail || existing?.connected_email || "Connected Account";
  updateData.connected_email = emailToSave;

  console.log("[Google OAuth] Saving tokens to Supabase:", {
    hasRefreshToken: !!activeRefreshToken,
    hasAccessToken: !!updateData.access_token,
    connectedEmail: emailToSave,
  });

  const { error } = await supabase
    .from("google_oauth_tokens")
    .upsert(updateData, { onConflict: "id" });

  if (error) {
    console.error("[Google OAuth] Failed to save tokens in Supabase:", error);
  } else {
    console.log("[Google OAuth] Tokens successfully saved to database.");
  }
}

let cachedTokenInfo: { data: any; timestamp: number } | null = null;
const TOKEN_CACHE_TTL = 60 * 1000; // 60 seconds

export async function getConnectedCalendarClient() {
  try {
    const now = Date.now();
    let data = cachedTokenInfo?.data;

    if (!cachedTokenInfo || now - cachedTokenInfo.timestamp > TOKEN_CACHE_TTL) {
      const supabase = createAdminClient();
      const { data: dbData, error } = await supabase
        .from("google_oauth_tokens")
        .select("*")
        .eq("id", 1)
        .single();

      if (error || !dbData) {
        return null;
      }
      data = dbData;
      cachedTokenInfo = { data: dbData, timestamp: now };
    }

    if (!data || (!data.refresh_token && !data.access_token)) {
      return null;
    }

    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({
      refresh_token: data.refresh_token || undefined,
      access_token: data.access_token || undefined,
      expiry_date: data.expiry_date || undefined,
    });

    // Auto-save refreshed tokens
    oauth2Client.on("tokens", (newTokens) => {
      saveGoogleTokens(newTokens);
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    return {
      calendar,
      calendarId: data.calendar_id || DEFAULT_CALENDAR_ID,
      connectedEmail: data.connected_email || "Connected",
      oauth2Client,
    };
  } catch (err) {
    console.error("[Google Calendar] Error retrieving client:", err);
    return null;
  }
}

export interface BookingCalendarPayload {
  id: string;
  client_name: string;
  email: string;
  phone: string;
  service: string;
  event_type: string;
  location: string;
  message?: string | null;
  booking_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM or HH:MM:SS
  end_time: string; // HH:MM or HH:MM:SS
  timezone: string;
}

export async function createGoogleCalendarEvent(booking: BookingCalendarPayload) {
  console.log("[Google Calendar] Attempting to create calendar event for booking:", booking.id);
  const clientInfo = await getConnectedCalendarClient();
  if (!clientInfo) {
    console.log("[Google Calendar] Client info unavailable or tokens missing. Skipping event creation.");
    return null;
  }

  const { calendar, calendarId } = clientInfo;

  // Format ISO strings
  const cleanStartTime = booking.start_time.substring(0, 5);
  const cleanEndTime = booking.end_time.substring(0, 5);
  const startDateTime = `${booking.booking_date}T${cleanStartTime}:00`;
  const endDateTime = `${booking.booking_date}T${cleanEndTime}:00`;

  const description = `
Client Name: ${booking.client_name}
Email: ${booking.email}
Phone: ${booking.phone}
Service: ${booking.service}
Event Type: ${booking.event_type}
Location: ${booking.location}
Notes: ${booking.message || "None"}

Booking Reference ID: ${booking.id}
`.trim();

  try {
    console.log("[Google Calendar] Inserting event:", {
      calendarId,
      summary: `${booking.service} — ${booking.client_name}`,
      startDateTime,
      endDateTime,
      timeZone: booking.timezone || "Asia/Kolkata",
    });

    const response = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `${booking.service} — ${booking.client_name}`,
        location: booking.location,
        description,
        start: {
          dateTime: startDateTime,
          timeZone: booking.timezone || "Asia/Kolkata",
        },
        end: {
          dateTime: endDateTime,
          timeZone: booking.timezone || "Asia/Kolkata",
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "popup", minutes: 60 * 24 },
            { method: "popup", minutes: 120 },
          ],
        },
      },
    });

    console.log("[Google Calendar] Event successfully created in Google Calendar! Event ID:", response.data.id);

    return {
      eventId: response.data.id || null,
      calendarId,
    };
  } catch (error) {
    console.error("[Google Calendar] Exception inserting Google Calendar Event:", error);
    return null;
  }
}

export async function updateGoogleCalendarEvent(
  googleEventId: string,
  booking: BookingCalendarPayload
) {
  const clientInfo = await getConnectedCalendarClient();
  if (!clientInfo || !googleEventId) return null;

  const { calendar, calendarId } = clientInfo;
  const startDateTime = `${booking.booking_date}T${booking.start_time.substring(0, 5)}:00`;
  const endDateTime = `${booking.booking_date}T${booking.end_time.substring(0, 5)}:00`;

  const description = `
Client Name: ${booking.client_name}
Email: ${booking.email}
Phone: ${booking.phone}
Service: ${booking.service}
Event Type: ${booking.event_type}
Location: ${booking.location}
Notes: ${booking.message || "None"}

Booking Reference ID: ${booking.id}
`.trim();

  try {
    const response = await calendar.events.update({
      calendarId,
      eventId: googleEventId,
      requestBody: {
        summary: `${booking.service} — ${booking.client_name}`,
        location: booking.location,
        description,
        start: {
          dateTime: startDateTime,
          timeZone: booking.timezone || "Asia/Kolkata",
        },
        end: {
          dateTime: endDateTime,
          timeZone: booking.timezone || "Asia/Kolkata",
        },
      },
    });

    return response.data.id;
  } catch (error) {
    console.error("Error updating Google Calendar Event:", error);
    return null;
  }
}

export async function deleteGoogleCalendarEvent(googleEventId: string) {
  const clientInfo = await getConnectedCalendarClient();
  if (!clientInfo || !googleEventId) return false;

  const { calendar, calendarId } = clientInfo;
  try {
    await calendar.events.delete({
      calendarId,
      eventId: googleEventId,
    });
    return true;
  } catch (error) {
    console.error("Error deleting Google Calendar Event:", error);
    return false;
  }
}

export async function getGoogleCalendarBusyBlocks(dateStr: string, timezone: string = "Asia/Kolkata") {
  const clientInfo = await getConnectedCalendarClient();
  if (!clientInfo) return [];

  const { calendar, calendarId } = clientInfo;
  const timeMin = `${dateStr}T00:00:00Z`;
  const timeMax = `${dateStr}T23:59:59Z`;

  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: timezone,
        items: [{ id: calendarId }],
      },
    });

    const busyList = response.data.calendars?.[calendarId]?.busy || [];
    return busyList.map(item => ({
      start: item.start!,
      end: item.end!,
    }));
  } catch (error) {
    console.error("Error checking Google Calendar free/busy status:", error);
    return [];
  }
}
