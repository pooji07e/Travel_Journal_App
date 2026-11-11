import { getTrips } from "@/server/trips";
import { TripCard } from "@/components/trips/TripCard";
import { TripsHeader } from "@/components/trips/TripsHeader";
import { BookOpen } from "lucide-react";

export default async function TripsPage() {
  const trips = await getTrips();

  return (
    <div className="space-y-8">
      <TripsHeader />

      {trips.length === 0 ? (
        <div className="border-2 border-dashed border-vintage-border rounded-lg p-12 text-center bg-paper-warm/30 space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-paper-aged border border-vintage-border flex items-center justify-center mx-auto shadow-stamp">
            <BookOpen className="w-7 h-7 text-mustard" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-ink">No Volumes Bound Yet</h3>
            <p className="font-body text-sm text-ink-muted mt-1">
              Your journal is empty. Bind your first travel volume to begin recording your expeditions.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
