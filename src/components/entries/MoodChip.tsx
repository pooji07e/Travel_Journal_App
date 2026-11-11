import React from "react";

const MOOD_DATA: Record<string, { label: string; icon: string; border: string }> = {
  JOYFUL: { label: "Joyful", icon: "✨", border: "border-mustard" },
  CALM: { label: "Calm", icon: "🍃", border: "border-teal" },
  NOSTALGIC: { label: "Nostalgic", icon: "📜", border: "border-vintage-border" },
  TIRED: { label: "Tired", icon: "☕", border: "border-ink-muted" },
  ADVENTUROUS: { label: "Adventurous", icon: "🧭", border: "border-teal" },
  ROMANTIC: { label: "Romantic", icon: "🌹", border: "border-rose" },
  HOMESICK: { label: "Homesick", icon: "🏡", border: "border-vintage-border" },
};

export function MoodChip({ mood }: { mood: string | null }) {
  if (!mood || !MOOD_DATA[mood]) return null;

  const data = MOOD_DATA[mood];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-typewriter uppercase tracking-wider bg-paper-aged border ${data.border} text-ink shadow-stamp`}
      title={`Mood: ${data.label}`}
    >
      <span className="text-xs">{data.icon}</span>
      <span>{data.label}</span>
    </span>
  );
}
