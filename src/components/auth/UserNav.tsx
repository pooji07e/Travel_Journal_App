"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase";
import { signOutAction } from "@/server/auth";
import { LogOut, User as UserIcon, Feather } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export function UserNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    user.user_metadata?.full_name ||
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

      <form action={signOutAction}>
        <button
          type="submit"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-typewriter uppercase tracking-wider text-rose-dark hover:text-rose hover:bg-rose/10 border border-vintage-border bg-paper-warm transition-colors shadow-stamp"
          title="Sign out of journal"
          aria-label="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Depart</span>
        </button>
      </form>
    </div>
  );
}
