import Link from "next/link";
import { Plus, BookOpen, Calendar, MapPin } from "lucide-react";

export default function TripsPage() {
  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-vintage-border pb-4">
        <div>
          <h1 className="font-heading font-bold text-3xl text-ink">My Travel Volumes</h1>
          <p className="font-body text-sm text-ink-muted mt-1">
            Every expedition is bound into its own chronicle.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal hover:bg-teal-dark text-paper font-typewriter text-xs uppercase tracking-wider rounded transition-colors shadow-stamp self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Volume</span>
        </button>
      </div>

      {/* Sample / Empty state Volumes shelf */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Trip Volume 1 */}
        <div className="bg-paper-warm border border-vintage-border rounded p-5 shadow-journal hover:translate-y-[-2px] transition-transform group">
          <div className="aspect-[16/9] bg-paper-aged border border-vintage-border rounded mb-4 flex items-center justify-center relative overflow-hidden">
            <BookOpen className="w-10 h-10 text-teal/40 group-hover:scale-105 transition-transform" />
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-typewriter uppercase tracking-wider bg-paper/90 border border-vintage-border text-ink">
              Volume I
            </div>
          </div>

          <h3 className="font-heading font-bold text-xl text-ink group-hover:text-teal transition-colors">
            Kyoto Autumn Whispers
          </h3>

          <div className="flex items-center gap-2 mt-2 text-xs font-typewriter text-ink-muted">
            <Calendar className="w-3.5 h-3.5" />
            <span>Oct 12 — Oct 26, 2024</span>
          </div>

          <div className="mt-4 pt-3 border-t border-vintage-border/50 flex items-center justify-between text-xs font-typewriter">
            <span className="text-ink-muted">14 Pages written</span>
            <span className="text-teal group-hover:underline">Open Volume &rarr;</span>
          </div>
        </div>

        {/* Create Volume Card */}
        <div className="border-2 border-dashed border-vintage-border rounded p-6 flex flex-col items-center justify-center text-center gap-3 bg-paper-warm/40 hover:bg-paper-warm transition-colors cursor-pointer min-h-[240px]">
          <div className="w-12 h-12 rounded-full border border-vintage-border bg-paper-aged flex items-center justify-center shadow-stamp">
            <Plus className="w-6 h-6 text-mustard" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-lg text-ink">Bind a New Volume</h4>
            <p className="font-handwriting text-base text-ink-muted mt-0.5">
              Start chronicling your next voyage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
