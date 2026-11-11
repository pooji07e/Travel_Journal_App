import { notFound } from "next/navigation";
import Link from "next/link";
import { getTrip } from "@/server/trips";
import { Timeline } from "@/components/entries/Timeline";
import { Calendar, Plus, Map, ArrowLeft, BookOpen } from "lucide-react";

interface TripPageProps {
  params: { id: string };
}

export default async function TripPage({ params }: TripPageProps) {
  const trip = await getTrip(params.id);

  if (!trip) {
    notFound();
  }

  const formatDate = (d: Date | null) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const dateRange =
    trip.startDate && trip.endDate
      ? `${formatDate(trip.startDate)} — ${formatDate(trip.endDate)}`
      : trip.startDate
      ? `Started ${formatDate(trip.startDate)}`
      : "Undated Voyage";

  return (
    <div className="space-y-8">
      {/* Volume Header Banner */}
      <div className="bg-paper-warm border border-vintage-border rounded-lg p-6 sm:p-8 shadow-journal relative washi-tape">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Link
              href="/trips"
              className="inline-flex items-center gap-1.5 text-xs font-typewriter text-ink-muted hover:text-ink transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Volumes</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-typewriter uppercase tracking-widest text-ink-muted bg-paper-aged px-2 py-0.5 rounded border border-vintage-border">
                Volume Chronicle
              </span>
            </div>

            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-ink">
              {trip.title}
            </h1>

            <div className="flex items-center gap-2 text-xs font-typewriter text-ink-muted">
              <Calendar className="w-3.5 h-3.5 text-teal" />
              <span>{dateRange}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto pt-2 sm:pt-0">
            <Link
              href={`/entries/new?tripId=${trip.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-dark text-paper font-typewriter text-xs uppercase tracking-wider rounded transition-colors shadow-stamp"
            >
              <Plus className="w-4 h-4" />
              <span>Inscribe Page</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Pages Timeline */}
      <section className="space-y-4">
        <Timeline tripId={trip.id} entries={trip.entries} />
      </section>
    </div>
  );
}
