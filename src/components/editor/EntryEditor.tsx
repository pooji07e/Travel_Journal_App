"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { AutosaveIndicator, type SaveStatus } from "@/components/editor/AutosaveIndicator";
import { patchEntry, createEntry } from "@/server/entries";
import {
  Calendar,
  MapPin,
  Music,
  Tag as TagIcon,
  Smile,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";

const MOODS = [
  { value: "JOYFUL", label: "Joyful", icon: "✨" },
  { value: "CALM", label: "Calm", icon: "🍃" },
  { value: "NOSTALGIC", label: "Nostalgic", icon: "📜" },
  { value: "TIRED", label: "Tired", icon: "☕" },
  { value: "ADVENTUROUS", label: "Adventurous", icon: "🧭" },
  { value: "ROMANTIC", label: "Romantic", icon: "🌹" },
  { value: "HOMESICK", label: "Homesick", icon: "🏡" },
] as const;

interface EntryEditorProps {
  tripId: string;
  initialEntry?: {
    id: string;
    title: string;
    date: Date;
    body: any;
    bodyText: string;
    status: "DRAFT" | "PUBLISHED";
    mood: string | null;
    placeName: string | null;
    lat: number | null;
    lng: number | null;
    spotifyUrl: string | null;
    updatedAt: Date;
    tags?: { tag: { name: string } }[];
  };
  isNew?: boolean;
}

export function EntryEditor({ tripId, initialEntry, isNew = false }: EntryEditorProps) {
  const router = useRouter();

  // State
  const [entryId, setEntryId] = useState<string | null>(initialEntry?.id || null);
  const [title, setTitle] = useState(initialEntry?.title || "");
  const [date, setDate] = useState(
    initialEntry?.date
      ? new Date(initialEntry.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    initialEntry?.status || "DRAFT"
  );
  const [mood, setMood] = useState<string | null>(initialEntry?.mood || null);
  const [placeName, setPlaceName] = useState(initialEntry?.placeName || "");
  const [spotifyUrl, setSpotifyUrl] = useState(initialEntry?.spotifyUrl || "");
  const [tagInput, setTagInput] = useState(
    initialEntry?.tags?.map((t) => t.tag.name).join(", ") || ""
  );
  const [body, setBody] = useState<any>(initialEntry?.body || null);
  const [bodyText, setBodyText] = useState(initialEntry?.bodyText || "");

  // Autosave tracking
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(
    initialEntry?.updatedAt ? new Date(initialEntry.updatedAt) : null
  );
  const [knownUpdatedAt, setKnownUpdatedAt] = useState<string>(
    initialEntry?.updatedAt ? new Date(initialEntry.updatedAt).toISOString() : new Date().toISOString()
  );
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);

  const isInitialMount = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced Autosave for existing entries
  const performAutosave = useCallback(async () => {
    if (!entryId || isNew) return;

    setSaveStatus("saving");
    try {
      const tagsArray = tagInput
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      const result = await patchEntry(entryId, {
        updatedAt: knownUpdatedAt,
        title: title.trim() || "Untitled Page",
        date: new Date(date).toISOString(),
        body,
        bodyText,
        status,
        mood: (mood as any) || null,
        placeName: placeName.trim() || null,
        spotifyUrl: spotifyUrl.trim() || null,
        tags: tagsArray,
      });

      if (result.conflict) {
        setSaveStatus("conflict");
        setConflictMessage(result.message);
      } else {
        setSaveStatus("saved");
        setLastSavedAt(new Date());
        if (result.updatedAt) {
          setKnownUpdatedAt(result.updatedAt);
        }
      }
    } catch (err: any) {
      console.error("Autosave error:", err);
      setSaveStatus("unsaved");
    }
  }, [entryId, isNew, knownUpdatedAt, title, date, body, bodyText, status, mood, placeName, spotifyUrl, tagInput]);

  // Trigger autosave when content changes (debounced by 2.5s)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!entryId || isNew) return;

    setSaveStatus("unsaved");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      performAutosave();
    }, 2500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [title, date, body, bodyText, status, mood, placeName, spotifyUrl, tagInput, entryId, isNew, performAutosave]);

  // Handle explicit save / creation
  const handleSavePage = async () => {
    const tagsArray = tagInput
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    setSaveStatus("saving");
    try {
      if (isNew || !entryId) {
        const res = await createEntry({
          tripId,
          title: title.trim() || "Untitled Page",
          date: new Date(date).toISOString(),
          body: body || { type: "doc", content: [] },
          bodyText,
          status,
          mood: (mood as any) || null,
          placeName: placeName.trim() || null,
          spotifyUrl: spotifyUrl.trim() || null,
          tags: tagsArray,
        });

        router.push(`/trips/${tripId}`);
        router.refresh();
      } else {
        await performAutosave();
        router.push(`/entries/${entryId}`);
      }
    } catch (err: any) {
      alert(err.message || "Failed to save page");
      setSaveStatus("unsaved");
    }
  };

  const handleResolveConflict = () => {
    if (confirm("Reload this page to fetch the latest version? Unsaved local changes will be replaced.")) {
      router.refresh();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-vintage-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/trips/${tripId}`}
            className="p-1.5 rounded border border-vintage-border bg-paper-warm hover:bg-paper-aged text-ink transition-colors shadow-xs"
            title="Return to Volume"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-typewriter uppercase tracking-widest text-ink-muted">
              {isNew ? "Drafting New Page" : "Editing Chronicle"}
            </span>
            <h1 className="font-heading font-bold text-2xl text-ink leading-tight">
              {title || "Untitled Page"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {!isNew && (
            <AutosaveIndicator
              status={saveStatus}
              lastSavedAt={lastSavedAt}
              onResolveConflict={handleResolveConflict}
            />
          )}

          <button
            type="button"
            onClick={handleSavePage}
            disabled={saveStatus === "saving"}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-dark text-paper font-typewriter text-xs uppercase tracking-wider rounded transition-colors shadow-stamp cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isNew ? "Inscribe Page" : "Save & View"}</span>
          </button>
        </div>
      </div>

      {conflictMessage && (
        <div className="p-3 rounded bg-rose/15 border border-rose text-ink text-xs font-typewriter flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose shrink-0" />
            <span>{conflictMessage}</span>
          </div>
          <button
            type="button"
            onClick={handleResolveConflict}
            className="underline font-bold hover:text-rose-dark cursor-pointer ml-2"
          >
            Reload
          </button>
        </div>
      )}

      {/* Main Page Canvas styled like a journal page */}
      <div className="bg-vintage-card border border-vintage-border rounded-lg p-6 sm:p-8 shadow-journal relative washi-tape space-y-6">
        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Page Title (e.g. Lost in the Bamboo Grove)"
            className="w-full text-2xl sm:text-3xl font-heading font-bold bg-transparent border-b border-vintage-border/40 focus:border-teal pb-2 focus:outline-none text-ink placeholder:text-ink-muted/40"
          />
        </div>

        {/* Metadata Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Date Picker */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-paper-warm border border-vintage-border rounded">
            <Calendar className="w-4 h-4 text-teal shrink-0" />
            <div className="flex flex-col flex-1">
              <span className="text-[9px] font-typewriter uppercase tracking-wider text-ink-muted">
                Date Written
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-xs font-typewriter text-ink focus:outline-none"
              />
            </div>
          </div>

          {/* Status Toggle (Draft vs Published) */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-paper-warm border border-vintage-border rounded">
            <Eye className="w-4 h-4 text-mustard shrink-0" />
            <div className="flex flex-col flex-1">
              <span className="text-[9px] font-typewriter uppercase tracking-wider text-ink-muted">
                Entry Status
              </span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
                className="bg-transparent text-xs font-typewriter text-ink focus:outline-none cursor-pointer"
              >
                <option value="DRAFT">Draft (Private)</option>
                <option value="PUBLISHED">Published (Bound)</option>
              </select>
            </div>
          </div>

          {/* Location Name */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-paper-warm border border-vintage-border rounded">
            <MapPin className="w-4 h-4 text-rose shrink-0" />
            <div className="flex flex-col flex-1">
              <span className="text-[9px] font-typewriter uppercase tracking-wider text-ink-muted">
                Location
              </span>
              <input
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Arashiyama, Kyoto"
                className="bg-transparent text-xs font-typewriter text-ink focus:outline-none placeholder:text-ink-muted/50"
              />
            </div>
          </div>
        </div>

        {/* Mood Stamp Picker */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-typewriter uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-mustard" />
            <span>Mood Stamp</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const isSelected = mood === m.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(isSelected ? null : m.value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-typewriter transition-all border ${
                    isSelected
                      ? "bg-paper-aged text-ink border-teal shadow-stamp font-bold ring-1 ring-teal"
                      : "bg-paper-warm text-ink-muted border-vintage-border hover:bg-paper-aged hover:text-ink"
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rich-Text Body (Tiptap) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-typewriter uppercase tracking-wider text-ink-muted">
            Chronicle Body
          </label>
          <TiptapEditor
            initialContent={body}
            onChange={({ json, text }) => {
              setBody(json);
              setBodyText(text);
            }}
          />
        </div>

        {/* Tags & Spotify Soundtracks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Tags Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-typewriter uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
              <TagIcon className="w-3.5 h-3.5 text-teal" />
              <span>Tags (comma-separated)</span>
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="bamboo, sunset, tea ceremony"
              className="w-full px-3 py-2 text-xs font-typewriter bg-paper-warm border border-vintage-border rounded focus:outline-none focus:ring-1 focus:ring-teal text-ink placeholder:text-ink-muted/50"
            />
          </div>

          {/* Spotify Soundtrack */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-typewriter uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-rose" />
              <span>Spotify Soundtrack Link</span>
            </label>
            <input
              type="url"
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              placeholder="https://open.spotify.com/track/..."
              className="w-full px-3 py-2 text-xs font-typewriter bg-paper-warm border border-vintage-border rounded focus:outline-none focus:ring-1 focus:ring-teal text-ink placeholder:text-ink-muted/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
