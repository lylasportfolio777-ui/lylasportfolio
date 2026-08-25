"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

// Simple in-memory rate limiter (5 failed attempts per 15 minutes per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) return false;
  if (now > entry.resetAt) {
    rateLimitMap.delete(ip);
    return false;
  }

  return entry.count >= 5;
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
  } else {
    entry.count += 1;
  }
}

function clearRateLimit(ip: string) {
  rateLimitMap.delete(ip);
}

export async function login(formData: FormData) {
  const reqHeaders = await headers();
  const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  // 1. Check rate limits
  if (isRateLimited(ip)) {
    redirect("/login?message=Too many failed attempts. Please try again in 15 minutes.");
  }

  // 2. Sanitize and validate inputs
  const rawEmail = formData.get("email") as string;
  const rawPassword = formData.get("password") as string;

  const email = (rawEmail || "").trim().toLowerCase();
  const password = rawPassword || "";

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email) || !password) {
    recordFailedAttempt(ip);
    redirect("/login?message=Invalid email or password.");
  }

  // 3. Authenticate with Supabase
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    recordFailedAttempt(ip);
    // Return a generic error message to prevent user enumeration
    redirect("/login?message=Invalid email or password.");
  }

  // Success — clear rate limit
  clearRateLimit(ip);

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
