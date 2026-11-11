import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto pt-8">
      <div className="bg-paper-warm border border-vintage-border rounded p-8 shadow-journal relative washi-tape">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-paper-aged border border-vintage-border mx-auto shadow-stamp">
            <BookOpen className="w-6 h-6 text-mustard" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-ink">Begin Your Chronicle</h1>
          <p className="font-body text-sm text-ink-muted">
            Create an account to start your travel journal
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-typewriter uppercase tracking-wider text-ink mb-1">
              Explorer Name
            </label>
            <input
              type="text"
              placeholder="Marco Polo"
              className="w-full px-3 py-2 text-sm bg-vintage-card border border-vintage-border rounded focus:outline-none focus:ring-1 focus:ring-teal text-ink placeholder:text-ink-muted/50"
            />
          </div>

          <div>
            <label className="block text-xs font-typewriter uppercase tracking-wider text-ink mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="explorer@atlas.com"
              className="w-full px-3 py-2 text-sm bg-vintage-card border border-vintage-border rounded focus:outline-none focus:ring-1 focus:ring-teal text-ink placeholder:text-ink-muted/50"
            />
          </div>

          <div>
            <label className="block text-xs font-typewriter uppercase tracking-wider text-ink mb-1">
              Choose Password
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
            <span>Create Journal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-vintage-border text-center space-y-3">
          <p className="text-xs font-body text-ink-muted">
            Already have a journal?{" "}
            <Link href="/login" className="text-teal hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
