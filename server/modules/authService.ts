import { createClient } from "@supabase/supabase-js";
import { ENV } from "../_core/env";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Verify Supabase JWT token and get user session
 */
export async function verifySupabaseToken(token: string) {
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return null;
    }
    return data.user;
  } catch (error) {
    console.error("[Auth] Failed to verify token:", error);
    return null;
  }
}

/**
 * Get user from Supabase session
 */
export async function getUserFromSession(token: string) {
  try {
    const user = await verifySupabaseToken(token);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split("@")[0],
      avatar: user.user_metadata?.avatar_url,
    };
  } catch (error) {
    console.error("[Auth] Failed to get user from session:", error);
    return null;
  }
}

/**
 * Create a Supabase auth URL for Google login
 */
export function getSupabaseAuthUrl(redirectTo: string) {
  const baseUrl = process.env.SUPABASE_URL || "";
  return `${baseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
}

/**
 * Exchange auth code for session
 */
export async function exchangeCodeForSession(code: string) {
  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.session) {
      return null;
    }
    return data.session;
  } catch (error) {
    console.error("[Auth] Failed to exchange code:", error);
    return null;
  }
}
