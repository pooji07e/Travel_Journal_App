"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { BookOpen, Compass, Plus, Settings, Feather } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Volumes", href: "/trips", icon: BookOpen },
    { label: "New Entry", href: "/entries/new", icon: Plus },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink relative selection:bg-mustard selection:text-ink">
      {/* Vintage atmospheric overlays */}
      <div className="paper-grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      {/* Header styled like a vintage book header */}
      <header className="sticky top-0 z-30 bg-paper-warm/95 backdrop-blur-sm border-b border-vintage-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/trips"
            className="group flex items-center gap-2.5 focus:outline-none"
            aria-label="Travel Journal Home"
          >
            <div className="w-9 h-9 rounded bg-paper-aged border border-vintage-border flex items-center justify-center shadow-stamp group-hover:rotate-[-3deg] transition-transform">
              <Feather className="w-5 h-5 text-teal" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg tracking-tight text-ink group-hover:text-teal transition-colors">
                Travel Journal
              </span>
              <span className="font-typewriter text-[10px] uppercase tracking-widest text-ink-muted -mt-1">
                Wanderer&apos;s Chronicle
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/trips" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs sm:text-sm font-typewriter tracking-wide transition-all ${
                    isActive
                      ? "bg-paper-aged text-ink border border-vintage-border shadow-stamp font-bold"
                      : "text-ink-muted hover:text-ink hover:bg-paper-warm"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="h-5 w-[1px] bg-vintage-border mx-1" />

            <ThemeSwitcher />
          </nav>
        </div>
      </header>

      {/* Main content body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 relative z-10">
        {children}
      </main>

      {/* Vintage Book Footer */}
      <footer className="border-t border-vintage-border bg-paper-warm/80 py-6 text-center text-xs font-typewriter text-ink-muted relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Vintage Travel Journal — Hand-crafted memories</p>
          <p className="font-handwriting text-sm text-ink-light">
            “Not all those who wander are lost.”
          </p>
        </div>
      </footer>
    </div>
  );
}
