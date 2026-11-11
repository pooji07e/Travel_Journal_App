"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { formatBytes, MEDIA_LIMITS } from "@/lib/limits";
import { HardDrive, Palette, User, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  // Preview storage used (e.g. 124 MB of 1 GB)
  const usedBytes = 124 * 1024 * 1024;
  const quotaBytes = MEDIA_LIMITS.USER_STORAGE_QUOTA_BYTES;
  const usedPercent = Math.round((usedBytes / quotaBytes) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading font-bold text-3xl text-ink">Journal Settings</h1>
        <p className="font-body text-sm text-ink-muted mt-1">
          Manage your travel chronicles, visual style, and storage quota.
        </p>
      </div>

      {/* Storage Quota Meter */}
      <section className="bg-paper-warm border border-vintage-border rounded p-6 shadow-journal space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-paper-aged border border-vintage-border flex items-center justify-center shadow-stamp">
            <HardDrive className="w-5 h-5 text-teal" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-ink">Storage Quota</h2>
            <p className="font-typewriter text-xs text-ink-muted">
              Photos &amp; Video Clips Archive
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-typewriter text-ink">
            <span>{formatBytes(usedBytes)} used</span>
            <span>{formatBytes(quotaBytes)} total quota</span>
          </div>

          <div className="w-full h-3 bg-paper-aged border border-vintage-border rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all ${
                usedPercent > MEDIA_LIMITS.WARNING_THRESHOLD_PERCENT
                  ? "bg-rose"
                  : "bg-teal"
              }`}
              style={{ width: `${Math.min(usedPercent, 100)}%` }}
            />
          </div>

          <p className="text-xs font-handwriting text-ink-light pt-1">
            {usedPercent}% used. High-resolution photos are automatically compressed to 1600px WebP.
          </p>
        </div>
      </section>

      {/* Theme Selection */}
      <section className="bg-paper-warm border border-vintage-border rounded p-6 shadow-journal space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-paper-aged border border-vintage-border flex items-center justify-center shadow-stamp">
            <Palette className="w-5 h-5 text-mustard" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-ink">Vintage Atmosphere</h2>
            <p className="font-typewriter text-xs text-ink-muted">
              Select your preferred aesthetic palette
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            type="button"
            onClick={() => setTheme("sepia")}
            className={`p-4 rounded border text-left transition-all ${
              theme === "sepia"
                ? "border-teal bg-paper-aged shadow-stamp ring-1 ring-teal"
                : "border-vintage-border bg-paper hover:bg-paper-aged"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-ink">Sepia Parchment</span>
              <div className="flex gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#F4ECD8] border border-stone-300" />
                <span className="w-4 h-4 rounded-full bg-[#5B4636]" />
                <span className="w-4 h-4 rounded-full bg-[#5F7F7A]" />
              </div>
            </div>
            <p className="text-xs font-body text-ink-muted">
              Warm, sunlit pages with rich mahogany ink and antique botanical tones.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setTheme("midnight")}
            className={`p-4 rounded border text-left transition-all ${
              theme === "midnight"
                ? "border-teal bg-paper-aged shadow-stamp ring-1 ring-teal"
                : "border-vintage-border bg-paper hover:bg-paper-aged"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-ink">Midnight Chronicle</span>
              <div className="flex gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#1B1815] border border-stone-600" />
                <span className="w-4 h-4 rounded-full bg-[#F2E8DC]" />
                <span className="w-4 h-4 rounded-full bg-[#6C928C]" />
              </div>
            </div>
            <p className="text-xs font-body text-ink-muted">
              Deep leather nightfall with glowing parchment text and celestial ink.
            </p>
          </button>
        </div>
      </section>
    </div>
  );
}
