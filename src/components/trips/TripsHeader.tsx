"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateTripModal } from "./CreateTripModal";

export function TripsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-vintage-border pb-4">
        <div>
          <h1 className="font-heading font-bold text-3xl text-ink">My Travel Volumes</h1>
          <p className="font-body text-sm text-ink-muted mt-1">
            Every expedition is bound into its own handcrafted chronicle.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal hover:bg-teal-dark text-paper font-typewriter text-xs uppercase tracking-wider rounded transition-colors shadow-stamp self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Volume</span>
        </button>
      </div>

      <CreateTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
