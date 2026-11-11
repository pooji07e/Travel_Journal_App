"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoodChip } from "./MoodChip";
import { Calendar, MapPin, Edit3, Trash2, Loader2, Music, Tag as TagIcon } from "lucide-react";
import { deleteEntry } from "@/server/entries";

interface EntryCardProps {
  entry: {
    id: string;
    tripId: string;
    title: string;
    date: Date;
    bodyText: string;
    status: "DRAFT" | "PUBLISHED";
    mood: string | null;
    placeName: string | null;
    spotifyUrl?: string | null;
    tags?: { tag: { name: string } }[];
  };
  rotationIndex?: number;
}

export function EntryCard({ entry, rotationIndex = 0 }: EntryCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  // Slight analog vintage rotations (-1deg, 0.8deg, -0.6deg, 1.2deg)
  const rotations = ["rotate-[-0.8deg]", "rotate-[1deg]", "rotate-[-1.2deg]", "rotate-[0.6deg]"];
  const rotationClass = rotations[rotationIndex % rotations.length];

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Delete page "${entry.title}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      await deleteEntry(entry.id);
      router.refresh();
    } catch (err) {
      alert("Failed to delete page");
      setDeleting(false);
    }
  };

  const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`polaroid-frame ${rotationClass} hover:rotate-0 transition-transform group relative bg-vintage-card flex flex-col justify-between`}
    >
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-vintage-border/40 text-xs font-typewriter">
          <div className="flex items-center gap-1.5 text-ink-muted">
            <Calendar className="w-3.5 h-3.5 text-teal" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {entry.status === "DRAFT" && (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-typewriter bg-mustard/20 text-mustard-dark border border-mustard/30">
                Draft
              </span>
            )}
            <MoodChip mood={entry.mood} />
          </div>
        </div>

        {/* Title */}
        <Link href={`/entries/${entry.id}`} className="block group">
          <h3 className="font-heading font-bold text-xl text-ink group-hover:text-teal transition-colors">
            {entry.title}
          </h3>
        </Link>

        {/* Location tag */}
        {entry.placeName && (
          <div className="flex items-center gap-1 mt-1 text-xs font-typewriter text-ink-muted">
            <MapPin className="w-3.5 h-3.5 text-rose shrink-0" />
            <span className="truncate">{entry.placeName}</span>
          </div>
        )}

        {/* Text snippet */}
        <p className="mt-3 font-body text-sm text-ink-light line-clamp-3 leading-relaxed">
          {entry.bodyText || "No text inscribed yet..."}
        </p>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {entry.tags.map((t, idx) => (
              <span
                key={idx}
                className="text-[10px] font-typewriter text-ink-muted bg-paper-warm px-2 py-0.5 rounded border border-vintage-border"
              >
                #{t.tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3 border-t border-vintage-border/50 flex items-center justify-between text-xs font-typewriter">
        <Link
          href={`/entries/${entry.id}`}
          className="text-teal font-semibold hover:underline"
        >
          Read Page &rarr;
        </Link>

        <div className="flex items-center gap-2">
          {entry.spotifyUrl && (
            <span title="Soundtrack attached">
              <Music className="w-3.5 h-3.5 text-rose" />
            </span>
          )}

          <Link
            href={`/entries/${entry.id}/edit`}
            className="p-1 text-ink-muted hover:text-teal transition-colors"
            title="Edit Page"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="p-1 text-ink-muted hover:text-rose transition-colors cursor-pointer"
            title="Delete Page"
          >
            {deleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
