"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import {
  createEntrySchema,
  patchEntrySchema,
  type CreateEntryInput,
  type PatchEntryInput,
} from "@/schemas/entry";
import { revalidatePath } from "next/cache";

export async function getEntry(id: string) {
  const user = await requireAuth();

  const entry = await prisma.entry.findFirst({
    where: { id, userId: user.id },
    include: {
      tags: {
        include: { tag: true },
      },
      media: {
        orderBy: { position: "asc" },
      },
      trip: {
        select: { id: true, title: true },
      },
    },
  });

  return entry;
}

/**
 * Creates an entry with tags in one transaction
 */
export async function createEntry(input: CreateEntryInput) {
  const user = await requireAuth();
  const validated = createEntrySchema.parse(input);

  // Verify trip belongs to user
  const trip = await prisma.trip.findFirst({
    where: { id: validated.tripId, userId: user.id },
  });

  if (!trip) {
    throw new Error("Specified Volume not found or unauthorized");
  }

  // Create entry and tags inside a single transaction
  const entry = await prisma.$transaction(async (tx) => {
    const newEntry = await tx.entry.create({
      data: {
        userId: user.id,
        tripId: validated.tripId,
        title: validated.title,
        body: validated.body,
        bodyText: validated.bodyText || "",
        date: new Date(validated.date),
        mood: validated.mood || null,
        status: validated.status || "DRAFT",
        placeName: validated.placeName || null,
        lat: validated.lat ?? null,
        lng: validated.lng ?? null,
        spotifyUrl: validated.spotifyUrl || null,
      },
    });

    // Handle tags if provided
    if (validated.tags && validated.tags.length > 0) {
      for (const tagName of validated.tags) {
        const cleanName = tagName.trim().toLowerCase();
        if (!cleanName) continue;

        const tag = await tx.tag.upsert({
          where: {
            userId_name: {
              userId: user.id,
              name: cleanName,
            },
          },
          update: {},
          create: {
            userId: user.id,
            name: cleanName,
          },
        });

        await tx.entryTag.create({
          data: {
            entryId: newEntry.id,
            tagId: tag.id,
          },
        });
      }
    }

    return newEntry;
  });

  revalidatePath(`/trips/${validated.tripId}`);
  return { id: entry.id };
}

/**
 * Autosave / Patch Entry with updatedAt conflict detection
 */
export async function patchEntry(id: string, input: PatchEntryInput) {
  const user = await requireAuth();
  const validated = patchEntrySchema.parse(input);

  const existing = await prisma.entry.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    throw new Error("Page not found or unauthorized");
  }

  // Conflict Detection: check if server updatedAt is newer than client's known timestamp
  const clientTime = new Date(validated.updatedAt).getTime();
  const serverTime = existing.updatedAt.getTime();

  // Allow a tiny 500ms margin for clock precision
  if (serverTime - clientTime > 500) {
    return {
      conflict: true as const,
      message: "This entry was modified in another session. Please reload to avoid losing changes.",
      serverUpdatedAt: existing.updatedAt.toISOString(),
    };
  }

  // Apply updates inside transaction
  const updated = await prisma.$transaction(async (tx) => {
    // Process tags update if provided
    if (validated.tags !== undefined) {
      // Remove old associations
      await tx.entryTag.deleteMany({
        where: { entryId: id },
      });

      for (const tagName of validated.tags) {
        const cleanName = tagName.trim().toLowerCase();
        if (!cleanName) continue;

        const tag = await tx.tag.upsert({
          where: {
            userId_name: {
              userId: user.id,
              name: cleanName,
            },
          },
          update: {},
          create: {
            userId: user.id,
            name: cleanName,
          },
        });

        await tx.entryTag.create({
          data: {
            entryId: id,
            tagId: tag.id,
          },
        });
      }
    }

    return tx.entry.update({
      where: { id },
      data: {
        ...(validated.title !== undefined && { title: validated.title }),
        ...(validated.body !== undefined && { body: validated.body }),
        ...(validated.bodyText !== undefined && { bodyText: validated.bodyText }),
        ...(validated.date !== undefined && { date: new Date(validated.date) }),
        ...(validated.mood !== undefined && { mood: validated.mood }),
        ...(validated.status !== undefined && { status: validated.status }),
        ...(validated.placeName !== undefined && { placeName: validated.placeName }),
        ...(validated.lat !== undefined && { lat: validated.lat }),
        ...(validated.lng !== undefined && { lng: validated.lng }),
        ...(validated.spotifyUrl !== undefined && { spotifyUrl: validated.spotifyUrl }),
      },
    });
  });

  revalidatePath(`/entries/${id}`);
  revalidatePath(`/trips/${existing.tripId}`);

  return {
    conflict: false as const,
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteEntry(id: string) {
  const user = await requireAuth();

  const existing = await prisma.entry.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    throw new Error("Page not found or unauthorized");
  }

  await prisma.entry.delete({
    where: { id },
  });

  revalidatePath(`/trips/${existing.tripId}`);
  return { success: true };
}
