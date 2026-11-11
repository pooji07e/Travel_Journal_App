import { notFound } from "next/navigation";
import Link from "next/link";
import { getEntry } from "@/server/entries";
import { MoodChip } from "@/components/entries/MoodChip";
import { TiptapRenderer } from "@/components/entries/TiptapRenderer";
import { ArrowLeft, Edit3, Calendar, MapPin, Music } from "lucide-react";

interface EntryPageProps {
  params: { id: string };
}

export default async function EntryPage({ params }: EntryPageProps) {
  const entry = await getEntry(params.id);

  if (!entry) {
    notFound();
  }

  const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/trips/${entry.tripId}`}
          className="inline-flex items-center gap-1.5 text-xs font-typewriter text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Volume: {entry.trip?.title}</span>
        </Link>

        <Link
          href={`/entries/${entry.id}/edit`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-vintage-border bg-paper-warm hover:bg-paper-aged text-xs font-typewriter text-ink uppercase tracking-wider transition-colors shadow-stamp"
        >
          <Edit3 className="w-3.5 h-3.5 text-teal" />
          <span>Edit Page</span>
        </Link>
      </div>

      {/* Antique Journal Page Frame */}
      <div className="bg-vintage-card border border-vintage-border rounded-lg p-8 sm:p-12 shadow-journal relative washi-tape space-y-6">
        {/* Page Header */}
        <header className="space-y-3 border-b border-vintage-border/50 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-typewriter text-ink-muted">
              <Calendar className="w-4 h-4 text-teal" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2">
              {entry.status === "DRAFT" && (
                <span className="px-2.5 py-0.5 rounded text-[11px] uppercase font-typewriter bg-mustard/20 text-mustard-dark border border-mustard/30">
                  Unpublished Draft
                </span>
              )}
              <MoodChip mood={entry.mood} />
            </div>
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-ink leading-tight">
            {entry.title}
          </h1>

          {entry.placeName && (
            <div className="flex items-center gap-1.5 text-xs font-typewriter text-ink-muted pt-1">
              <MapPin className="w-3.5 h-3.5 text-rose shrink-0" />
              <span>{entry.placeName}</span>
            </div>
          )}
        </header>

        {/* Rich Text Body */}
        <div className="py-2">
          <TiptapRenderer content={entry.body} />
        </div>

        {/* Optional Spotify link notice */}
        {entry.spotifyUrl && (
          <div className="pt-4 border-t border-vintage-border/40">
            <div className="flex items-center gap-2 text-xs font-typewriter text-ink-muted p-3 bg-paper-warm rounded border border-vintage-border">
              <Music className="w-4 h-4 text-rose shrink-0" />
              <span>Soundtrack linked: </span>
              <a
                href={entry.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:underline truncate max-w-md"
              >
                {entry.spotifyUrl}
              </a>
            </div>
          </div>
        )}

        {/* Page Footer / Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <footer className="pt-4 border-t border-vintage-border/40 flex flex-wrap items-center gap-2">
            <span className="text-xs font-typewriter text-ink-muted">Tags:</span>
            {entry.tags.map((t, idx) => (
              <span
                key={idx}
                className="text-xs font-typewriter text-ink-muted bg-paper-warm px-2.5 py-0.5 rounded border border-vintage-border shadow-xs"
              >
                #{t.tag.name}
              </span>
            ))}
          </footer>
        )}
      </div>
    </article>
  );
}
