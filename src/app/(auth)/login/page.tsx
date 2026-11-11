import Link from "next/link";
import { Feather, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto pt-8">
      <div className="bg-paper-warm border border-vintage-border rounded p-8 shadow-journal relative washi-tape">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-paper-aged border border-vintage-border mx-auto shadow-stamp">
            <Feather className="w-6 h-6 text-teal" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-ink">Open Your Journal</h1>
          <p className="font-body text-sm text-ink-muted">
            Sign in to continue recording your journeys
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-typewriter uppercase tracking-wider text-ink mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="wanderer@odyssey.com"
              className="w-full px-3 py-2 text-sm bg-vintage-card border border-vintage-border rounded focus:outline-none focus:ring-1 focus:ring-teal text-ink placeholder:text-ink-muted/50"
            />
          </div>

          <div>
            <label className="block text-xs font-typewriter uppercase tracking-wider text-ink mb-1">
              Secret Key (Password)
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full px-3 py-2 text-sm bg-vintage-card border border-vintage-border rounded focus:outline-none focus:ring-1 focus:ring-teal text-ink placeholder:text-ink-muted/50"
            />
          </div>

          <button
            type="button"
            className="w-full py-2.5 px-4 bg-teal hover:bg-teal-dark text-paper font-typewriter text-xs uppercase tracking-wider rounded transition-colors shadow-stamp flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-vintage-border text-center space-y-3">
          <button
            type="button"
            className="w-full py-2 px-4 bg-paper-aged hover:bg-paper border border-vintage-border text-ink font-typewriter text-xs uppercase tracking-wider rounded transition-colors shadow-sm"
          >
            Sign In with Google
          </button>

          <p className="text-xs font-body text-ink-muted">
            New traveler?{" "}
            <Link href="/signup" className="text-teal hover:underline font-semibold">
              Create a Volume
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
