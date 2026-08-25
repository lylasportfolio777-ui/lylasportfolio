import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Google OAuth has been disabled." }, { status: 404 });
}

