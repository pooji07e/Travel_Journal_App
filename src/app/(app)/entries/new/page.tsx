import { getTrips } from "@/server/trips";
import { EntryEditor } from "@/components/editor/EntryEditor";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";

interface NewEntryPageProps {
  searchParams: { tripId?: string };
}

export default async function NewEntryPage({ searchParams }: NewEntryPageProps) {
  const trips = await getTrips();

  if (trips.length === 0) {
    return (
      <div className="border-2 border-dashed border-vintage-border rounded-lg p-12 text-center bg-paper-warm/40 space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-paper-aged border border-vintage-border flex items-center justify-center mx-auto shadow-stamp">
          <BookOpen className="w-6 h-6 text-mustard" />
        </div>
        <h2 className="font-heading font-bold text-xl text-ink">No Volumes Available</h2>
        <p className="font-body text-sm text-ink-muted">
          Before writing pages, you must bind at least one travel volume to contain them.
        </p>
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal hover:bg-teal-dark text-paper font-typewriter text-xs uppercase tracking-wider rounded transition-colors shadow-stamp"
        >
          <Plus className="w-4 h-4" />
          <span>Create a Volume</span>
        </Link>
      </div>
    );
  }

  // Determine active tripId
  const activeTripId =
    searchParams.tripId && trips.some((t) => t.id === searchParams.tripId)
      ? searchParams.tripId
      : trips[0].id;

  return (
    <div className="space-y-4">
      <EntryEditor tripId={activeTripId} isNew={true} />
    </div>
  );
}
