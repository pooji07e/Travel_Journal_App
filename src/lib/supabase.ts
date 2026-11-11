import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components
 */
export function createBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createBrowserClient(url, anonKey);
}

// Default export alias
export const createClient = createBrowserSupabase;
