"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Calendar, Trash2, Loader2, ArrowRight } from "lucide-react";
import { deleteTrip } from "@/server/trips";

interface TripCardProps {
  trip: {
    id: string;
    title: string;
    startDate: Date | null;
    endDate: Date | null;
    _count?: { entries: number };
  };
}

export function TripCard({ trip }: TripCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${trip.title}" and all its pages?`)) {
      return;
    }

    setDeleting(true);
    try {
      await deleteTrip(trip.id);
      router.refresh();
    } catch (err) {
      alert("Failed to delete volume");
      setDeleting(false);
    }
  };

  const formatDate = (d: Date | null) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const dateDisplay =
    trip.startDate && trip.endDate
      ? `${formatDate(trip.startDate)} — ${formatDate(trip.endDate)}`
      : trip.startDate
      ? `From ${formatDate(trip.startDate)}`
      : "Undated Expedition";

  const entryCount = trip._count?.entries ?? 0;

  return (
    <div className="bg-paper-warm border border-vintage-border rounded p-5 shadow-journal hover:translate-y-[-2px] transition-all group relative flex flex-col justify-between">
      <div>
        <Link href={`/trips/${trip.id}`} className="block">
          <div className="aspect-[16/9] bg-paper-aged border border-vintage-border rounded mb-4 flex items-center justify-center relative overflow-hidden group-hover:bg-paper transition-colors">
            <BookOpen className="w-10 h-10 text-teal/40 group-hover:scale-105 transition-transform" />
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-typewriter uppercase tracking-wider bg-paper/90 border border-vintage-border text-ink">
              Volume
            </div>
          </div>

          <h3 className="font-heading font-bold text-xl text-ink group-hover:text-teal transition-colors">
            {trip.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 mt-2 text-xs font-typewriter text-ink-muted">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{dateDisplay}</span>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-vintage-border/50 flex items-center justify-between text-xs font-typewriter">
        <span className="text-ink-muted">
          {entryCount} {entryCount === 1 ? "Page" : "Pages"} written
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-ink-muted hover:text-rose p-1 transition-colors"
            title="Delete Volume"
            aria-label="Delete Volume"
          >
            {deleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>

          <Link
            href={`/trips/${trip.id}`}
            className="text-teal group-hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Open</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
