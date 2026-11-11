"use client";

import { Check, Loader2, AlertTriangle, Cloud } from "lucide-react";

export type SaveStatus = "saved" | "saving" | "unsaved" | "conflict";

interface AutosaveIndicatorProps {
  status: SaveStatus;
  lastSavedAt?: Date | null;
  onResolveConflict?: () => void;
}

export function AutosaveIndicator({
  status,
  lastSavedAt,
  onResolveConflict,
}: AutosaveIndicatorProps) {
  if (status === "saving") {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-paper-warm border border-vintage-border text-xs font-typewriter text-teal shadow-xs">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Inscribing changes...</span>
      </div>
    );
  }

  if (status === "conflict") {
    return (
      <button
        type="button"
        onClick={onResolveConflict}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose/15 border border-rose text-xs font-typewriter text-rose-dark hover:bg-rose/25 transition-colors shadow-stamp cursor-pointer"
        title="Conflict: Modified elsewhere. Click to reload page."
      >
        <AlertTriangle className="w-3.5 h-3.5 text-rose shrink-0" />
        <span>Conflict detected — Click to reload</span>
      </button>
    );
  }

  if (status === "unsaved") {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-paper-warm border border-vintage-border text-xs font-typewriter text-mustard shadow-xs">
        <Cloud className="w-3.5 h-3.5" />
        <span>Unsaved edits...</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-paper-warm border border-vintage-border text-xs font-typewriter text-ink-muted shadow-xs">
      <Check className="w-3.5 h-3.5 text-teal" />
      <span>
        {lastSavedAt
          ? `Saved at ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
          : "Saved"}
      </span>
    </div>
  );
}
