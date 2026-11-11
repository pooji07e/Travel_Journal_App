"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase";
import { LogOut, Feather, Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export function UserNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | { email?: string; user_metadata?: { displayName?: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    // Check guest cookie
    const hasGuestCookie = document.cookie
      .split("; ")
      .some((row) => row.startsWith("vintage_guest=true"));

    if (hasGuestCookie) {
      setUser({
        email: "wanderer@journal.local",
        user_metadata: { displayName: "Guest Explorer" },
      });
      setLoading(false);
      return;
    }

    const supabase = createBrowserSupabase();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      // Clear guest cookie
      document.cookie = "vintage_guest=; path=/; max-age=0";

      const supabase = createBrowserSupabase();
      await supabase.auth.signOut();
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Sign out error:", e);
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-paper-aged animate-pulse border border-vintage-border" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-typewriter uppercase tracking-wider text-ink border border-vintage-border bg-paper-warm hover:bg-paper-aged transition-all shadow-stamp"
      >
        <Feather className="w-3.5 h-3.5 text-teal" />
        <span>Sign In</span>
      </Link>
    );
  }

  const name =
    user.user_metadata?.displayName ||
    (user as any).user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Traveler";

  return (
    <div className="flex items-center gap-2">
      <div
        className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-paper-aged border border-vintage-border text-xs font-typewriter text-ink shadow-sm"
        title={`Logged in as ${user.email}`}
      >
        <div className="w-4 h-4 rounded-full bg-teal text-paper flex items-center justify-center text-[10px] font-bold">
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="max-w-[100px] truncate">{name}</span>
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-typewriter uppercase tracking-wider text-rose-dark hover:text-rose hover:bg-rose/10 border border-vintage-border bg-paper-warm transition-colors shadow-stamp disabled:opacity-50 cursor-pointer"
        title="Sign out of journal"
        aria-label="Sign out"
      >
        {signingOut ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <LogOut className="w-3.5 h-3.5" />
        )}
        <span className="hidden md:inline">Depart</span>
      </button>
    </div>
  );
}
