import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

interface CookieToSet {
  name: string;
  value: string;
  options?: CookieOptions;
}

export const DEMO_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "wanderer@journal.local",
  user_metadata: {
    displayName: "Marco Polo",
    full_name: "Marco Polo",
  },
  app_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

/**
 * Supabase client for Server Actions and Route Handlers
 */
export async function createServerSupabaseClient() {
  const cookieStore = cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignored if called from Server Component
        }
      },
    },
  });
}

/**
 * Helper to get the current authenticated user session on the server.
 */
export async function getCurrentUser() {
  const cookieStore = cookies();
  const isGuest = cookieStore.get("vintage_guest")?.value === "true";

  if (isGuest) {
    return DEMO_USER as any;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Requires an authenticated user session or throws unauthorized error.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign in to continue");
  }
  return user;
}
