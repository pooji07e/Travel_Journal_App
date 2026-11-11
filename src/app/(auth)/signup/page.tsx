"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { signUpAction } from "@/server/auth";
import { createBrowserSupabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signUpAction(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setGoogleLoading(true);
    const supabase = createBrowserSupabase();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/trips`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-8">
      <div className="bg-paper-warm border border-vintage-border rounded p-8 shadow-journal relative washi-tape">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-paper-aged border border-vintage-border mx-auto shadow-stamp">
            <BookOpen className="w-6 h-6 text-mustard" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-ink">Begin Your Chronicle</h1>
          <p className="font-body text-sm text-ink-muted">
            Create an account to start binding your travel volumes
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-rose/15 border border-rose text-ink text-xs font-typewriter flex items-start gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 text-rose shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-teal/15 border border-teal text-teal flex items-center justify-center mx-auto shadow-stamp">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-bold text-xl text-ink">Welcome, Traveler!</h2>
            <p className="font-body text-sm text-ink-light">
              Your journal volume has been created. If your Supabase configuration requires email verification, please check your inbox to confirm your email before signing in.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal text-paper font-typewriter text-xs uppercase tracking-wider rounded shadow-stamp hover:bg-teal-dark transition-colors"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="displayName"
                className="block text-xs font-typewriter uppercase tracking-wider text-ink mb-1"
              >
                Explorer Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                placeholder="Marco Polo"
                className="w-full px-3 py-2 text-sm bg-vintage-card border border-vintage-border rounded focus:outline-none focus:ring-1 focus:ring-teal text-ink placeholder:text-ink-muted/50"
              />
            </div>

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
                placeholder="explorer@atlas.com"
                className="w-full px-3 py-2 text-sm bg-vintage-card border border-vintage-border rounded focus:outline-none focus:ring-1 focus:ring-teal text-ink placeholder:text-ink-muted/50"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-typewriter uppercase tracking-wider text-ink mb-1"
              >
                Choose Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
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
                  <span>Binding Chronicle...</span>
                </>
              ) : (
                <>
                  <span>Create Journal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {!success && (
          <div className="mt-6 pt-6 border-t border-vintage-border text-center space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading || googleLoading}
              className="w-full py-2.5 px-4 bg-paper-aged hover:bg-paper border border-vintage-border text-ink font-typewriter text-xs uppercase tracking-wider rounded transition-colors shadow-stamp flex items-center justify-center gap-2 disabled:opacity-60"
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
              <span>Continue with Google</span>
            </button>

            <p className="text-xs font-body text-ink-muted">
              Already have a journal?{" "}
              <Link href="/login" className="text-teal hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
