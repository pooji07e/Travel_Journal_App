"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, X, Loader2, Calendar } from "lucide-react";
import { createTrip } from "@/server/trips";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTripModal({ isOpen, onClose }: CreateTripModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const trip = await createTrip({
        title: title.trim(),
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      });

      onClose();
      setTitle("");
      setStartDate("");
      setEndDate("");
      router.push(`/trips/${trip.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to bind new volume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs">
      <div className="bg-paper-warm border border-vintage-border rounded max-w-md w-full p-6 shadow-journal relative washi-tape animate-fade-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-muted hover:text-ink transition-colors p-1"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-paper-aged border border-vintage-border flex items-center justify-center shadow-stamp">
            <BookOpen className="w-5 h-5 text-mustard" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-ink">Bind a New Volume</h2>
            <p className="font-typewriter text-[11px] text-ink-muted uppercase tracking-wider">
              Chronicle a New Journey
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded bg-rose/15 border border-rose text-ink text-xs font-typewriter">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-typewriter uppercase tracking-wider text-ink mb-1">
              Volume Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kyoto Autumn Whispers"
              className="w-full px-3 py-2 text-sm bg-vintage-card border border-vintage-border rounded focus:outline-none focus:ring-1 focus:ring-teal text-ink placeholder:text-ink-muted/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-typewriter uppercase tracking-wider text-ink mb-1">
                Departure Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-vintage-card border border-vintage-border rounded focus:outline-none focus:ring-1 focus:ring-teal text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-typewriter uppercase tracking-wider text-ink mb-1">
                Return Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-vintage-card border border-vintage-border rounded focus:outline-none focus:ring-1 focus:ring-teal text-ink"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-vintage-border/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-typewriter uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-5 py-2 bg-teal hover:bg-teal-dark disabled:opacity-60 text-paper font-typewriter text-xs uppercase tracking-wider rounded transition-colors shadow-stamp flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Binding...</span>
                </>
              ) : (
                <span>Create Volume</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
