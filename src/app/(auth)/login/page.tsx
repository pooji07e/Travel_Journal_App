"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Feather, ArrowRight, Loader2, AlertCircle, Compass } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/trips";

  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth_failed"
      ? "Authentication failed. Please try signing in again."
      : null
  );
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGuestEntry = () => {
    // Set 24-hour guest cookie for instant local preview
    document.cookie = "vintage_guest=true; path=/; max-age=86400";
    router.push(redirectTo);
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Please provide both email and password.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createBrowserSupabase();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in. Please check your credentials.";
      setError(message);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const supabase = createBrowserSupabase();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            redirectTo
          )}`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to initiate Google sign in.";
      setError(message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="bg-paper-warm border border-vintage-border rounded p-8 shadow-journal relative washi-tape">
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-paper-aged border border-vintage-border mx-auto shadow-stamp">
          <Feather className="w-6 h-6 text-teal" />
        </div>
        <h1 className="font-heading font-bold text-2xl text-ink">Open Your Journal</h1>
        <p className="font-body text-sm text-ink-muted">
          Sign in to access your private travel volumes
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-rose/15 border border-rose text-ink text-xs font-typewriter flex items-start gap-2 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Demo / Guest Access Banner */}
      <div className="mb-5 p-3.5 rounded border border-mustard/40 bg-paper-aged/60 text-center space-y-2 shadow-sm">
        <p className="text-xs font-typewriter text-ink">
          Want to test the app without setting up credentials?
        </p>
        <button
          type="button"
          onClick={handleGuestEntry}
          className="w-full py-2 px-3 bg-mustard hover:bg-mustard-dark text-ink font-typewriter text-xs uppercase tracking-wider rounded transition-colors shadow-stamp flex items-center justify-center gap-2 font-bold cursor-pointer"
        >
          <Compass className="w-4 h-4 text-ink" />
          <span>Enter as Guest Explorer (Demo Mode)</span>
        </button>
      </div>

      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-vintage-border" />
        </div>
        <span className="relative bg-paper-warm px-3 text-[11px] font-typewriter uppercase tracking-wider text-ink-muted">
          Or sign in with account
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-typewriter uppercase tracking-wider text-ink mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="wanderer@odyssey.com"
            className="w-full px-3 py-2 text-sm bg-vintage-card border border-vintage-border rounded focus:outline-none focus:ring-1 focus:ring-teal text-ink placeholder:text-ink-muted/50"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-typewriter uppercase tracking-wider text-ink mb-1"
          >
            Secret Key (Password)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            placeholder="••••••••••••"
            className="w-full px-3 py-2 text-sm bg-vintage-card border border-vintage-border rounded focus:outline-none focus:ring-1 focus:ring-teal text-ink placeholder:text-ink-muted/50"
          />
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full py-2.5 px-4 bg-teal hover:bg-teal-dark disabled:opacity-60 text-paper font-typewriter text-xs uppercase tracking-wider rounded transition-colors shadow-stamp flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-vintage-border text-center space-y-3">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="w-full py-2.5 px-4 bg-paper-aged hover:bg-paper border border-vintage-border text-ink font-typewriter text-xs uppercase tracking-wider rounded transition-colors shadow-stamp flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {googleLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-mustard" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.2.2-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.8-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
              />
            </svg>
          )}
          <span>Sign In with Google</span>
        </button>

        <p className="text-xs font-body text-ink-muted">
          New traveler?{" "}
          <Link href="/signup" className="text-teal hover:underline font-semibold">
            Create a Volume
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto pt-8">
      <Suspense
        fallback={
          <div className="bg-paper-warm border border-vintage-border rounded p-8 text-center text-xs font-typewriter text-ink-muted">
            Opening chronicle...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
