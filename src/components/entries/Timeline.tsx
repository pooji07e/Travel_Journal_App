import { EntryCard } from "./EntryCard";
import { Plus, BookOpen, Feather } from "lucide-react";
import Link from "next/link";

interface TimelineProps {
  tripId: string;
  entries: any[];
}

export function Timeline({ tripId, entries }: TimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="border-2 border-dashed border-vintage-border rounded-lg p-12 text-center bg-paper-warm/40 space-y-4 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-full bg-paper-aged border border-vintage-border flex items-center justify-center mx-auto shadow-stamp">
          <Feather className="w-7 h-7 text-teal" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-xl text-ink">An Unwritten Volume</h3>
          <p className="font-body text-sm text-ink-muted mt-1">
            This volume has no pages yet. Inscribe your first memory to begin this expedition&apos;s story.
          </p>
        </div>
        <Link
          href={`/entries/new?tripId=${tripId}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal hover:bg-teal-dark text-paper font-typewriter text-xs uppercase tracking-wider rounded transition-colors shadow-stamp"
        >
          <Plus className="w-4 h-4" />
          <span>Inscribe First Page</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs font-typewriter text-ink-muted border-b border-vintage-border/50 pb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-mustard" />
          <span>{entries.length} {entries.length === 1 ? "page" : "pages"} bound in chronological sequence</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {entries.map((entry, index) => (
          <EntryCard key={entry.id} entry={entry} rotationIndex={index} />
        ))}
      </div>
    </div>
  );
}
