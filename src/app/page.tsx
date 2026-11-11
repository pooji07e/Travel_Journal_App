import Link from "next/link";
import { BookOpen, Compass, Feather, MapPin, Music, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-4 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-vintage-border bg-paper-warm text-ink text-xs font-typewriter shadow-stamp">
          <Sparkles className="w-3.5 h-3.5 text-mustard" />
          <span>Volume I · Wanderer&apos;s Edition</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-bold text-ink leading-tight">
          Your journeys, preserved in leather &amp; ink.
        </h1>

        <p className="text-lg sm:text-xl font-body text-ink-light max-w-2xl mx-auto leading-relaxed">
          Open a worn leather journal, not a social feed. Keep trips as volumes, write entries as
          pages with polaroids, short clips, maps, and soundtracks.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 px-6 py-3 rounded bg-teal text-paper font-typewriter text-sm uppercase tracking-wider hover:bg-teal-dark transition-all shadow-md focus:outline-none"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open My Journal</span>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded border border-vintage-border bg-paper-warm text-ink font-typewriter text-sm uppercase tracking-wider hover:bg-paper-aged transition-all shadow-stamp focus:outline-none"
          >
            <Feather className="w-4 h-4" />
            <span>Sign In</span>
          </Link>
        </div>
      </section>

      {/* Torn edge separator */}
      <div className="torn-divider max-w-xl mx-auto" />

      {/* Feature Highlights with Polaroid / Stamp Styling */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="polaroid-frame rotate-[-1deg] hover:rotate-0 transition-transform">
          <div className="aspect-[4/3] bg-paper-warm border border-vintage-border flex items-center justify-center p-6 text-center">
            <BookOpen className="w-12 h-12 text-teal mb-2 stroke-[1.5]" />
          </div>
          <div className="pt-4 text-center">
            <h3 className="font-heading font-bold text-lg text-ink">Volumes &amp; Pages</h3>
            <p className="font-handwriting text-base text-ink-muted mt-1">
              Organize each voyage into its own distinct leather-bound chronicle.
            </p>
          </div>
        </div>

        <div className="polaroid-frame rotate-[1.5deg] hover:rotate-0 transition-transform">
          <div className="aspect-[4/3] bg-paper-warm border border-vintage-border flex items-center justify-center p-6 text-center">
            <Compass className="w-12 h-12 text-mustard mb-2 stroke-[1.5]" />
          </div>
          <div className="pt-4 text-center">
            <h3 className="font-heading font-bold text-lg text-ink">Cartography &amp; Places</h3>
            <p className="font-handwriting text-base text-ink-muted mt-1">
              Pin moments to vintage outdoor maps with precise coordinates.
            </p>
          </div>
        </div>

        <div className="polaroid-frame rotate-[-1.5deg] hover:rotate-0 transition-transform">
          <div className="aspect-[4/3] bg-paper-warm border border-vintage-border flex items-center justify-center p-6 text-center">
            <Music className="w-12 h-12 text-rose mb-2 stroke-[1.5]" />
          </div>
          <div className="pt-4 text-center">
            <h3 className="font-heading font-bold text-lg text-ink">Soundtrack of the Road</h3>
            <p className="font-handwriting text-base text-ink-muted mt-1">
              Attach ambient Spotify songs to accompany each written memory.
            </p>
          </div>
        </div>
      </section>

      {/* Design System Preview / Palette Badge */}
      <section className="p-6 rounded border border-vintage-border bg-paper-warm max-w-2xl mx-auto shadow-journal text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-typewriter uppercase tracking-widest text-ink-muted">
          <MapPin className="w-3.5 h-3.5 text-teal" />
          <span>Crafted with vintage design tokens</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border border-vintage-border bg-[#F4ECD8] shadow-sm" title="Paper #F4ECD8" />
          <div className="w-8 h-8 rounded-full border border-vintage-border bg-[#5B4636] shadow-sm" title="Ink #5B4636" />
          <div className="w-8 h-8 rounded-full border border-vintage-border bg-[#5F7F7A] shadow-sm" title="Teal #5F7F7A" />
          <div className="w-8 h-8 rounded-full border border-vintage-border bg-[#C48B8B] shadow-sm" title="Rose #C48B8B" />
          <div className="w-8 h-8 rounded-full border border-vintage-border bg-[#C9A24B] shadow-sm" title="Mustard #C9A24B" />
        </div>
        <p className="text-xs font-typewriter text-ink-muted">
          Sepia &amp; Midnight themes · Playfair Display · Lora · Special Elite · Caveat
        </p>
      </section>
    </div>
  );
}
