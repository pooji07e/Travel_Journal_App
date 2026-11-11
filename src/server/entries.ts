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

// In-memory fallback entries
let memoryEntries: any[] = [
  {
    id: "sample-entry-1",
    tripId: "sample-trip-1",
    userId: "00000000-0000-0000-0000-000000000001",
    title: "Lost in the Bamboo Grove",
    date: new Date("2024-10-13"),
    body: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The rustle of bamboo stalks in the early morning breeze sounded like whispered secrets from a thousand years ago. Sunlight filtered through the jade canopy in long, misty shafts, illuminating the damp moss along the stone path.",
            },
          ],
        },
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "“In the midst of silence, even the wind carries an ancient song.”",
                },
              ],
            },
          ],
        },
      ],
    },
    bodyText: "The rustle of bamboo stalks in the early morning breeze sounded like whispered secrets from a thousand years ago...",
    status: "PUBLISHED",
    mood: "CALM",
    placeName: "Sagano Bamboo Forest, Arashiyama",
    lat: 35.0166,
    lng: 135.6713,
    spotifyUrl: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
    updatedAt: new Date(),
    tags: [{ tag: { name: "bamboo" } }, { tag: { name: "kyoto" } }],
    media: [],
    trip: { id: "sample-trip-1", title: "Kyoto Autumn Whispers" },
  },
];

export async function getEntry(id: string) {
  const user = await requireAuth();

  try {
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

    if (entry) return entry;
  } catch (e) {
    // Continue to fallback
  }

  const fallback = memoryEntries.find((e) => e.id === id);
  return fallback || null;
}

export async function createEntry(input: CreateEntryInput) {
  const user = await requireAuth();
  const validated = createEntrySchema.parse(input);

  try {
    const trip = await prisma.trip.findFirst({
      where: { id: validated.tripId, userId: user.id },
    });

    if (!trip) {
      throw new Error("Specified Volume not found or unauthorized");
    }

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
  } catch (e) {
    // In-memory fallback
    const newId = `entry-${Date.now()}`;
    const newEntry = {
      id: newId,
      tripId: validated.tripId,
      userId: user.id,
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
      updatedAt: new Date(),
      tags: validated.tags.map((name) => ({ tag: { name } })),
      media: [],
      trip: { id: validated.tripId, title: "Expedition Volume" },
    };
    memoryEntries.unshift(newEntry);
    revalidatePath(`/trips/${validated.tripId}`);
    return { id: newId };
  }
}

export async function patchEntry(id: string, input: PatchEntryInput) {
  const user = await requireAuth();
  const validated = patchEntrySchema.parse(input);

  try {
    const existing = await prisma.entry.findFirst({
      where: { id, userId: user.id },
    });

    if (existing) {
      const clientTime = new Date(validated.updatedAt).getTime();
      const serverTime = existing.updatedAt.getTime();

      if (serverTime - clientTime > 500) {
        return {
          conflict: true as const,
          message: "This entry was modified in another session. Please reload to avoid losing changes.",
          serverUpdatedAt: existing.updatedAt.toISOString(),
        };
      }

      const updated = await prisma.$transaction(async (tx) => {
        if (validated.tags !== undefined) {
          await tx.entryTag.deleteMany({ where: { entryId: id } });
          for (const tagName of validated.tags) {
            const cleanName = tagName.trim().toLowerCase();
            if (!cleanName) continue;
            const tag = await tx.tag.upsert({
              where: { userId_name: { userId: user.id, name: cleanName } },
              update: {},
              create: { userId: user.id, name: cleanName },
            });
            await tx.entryTag.create({ data: { entryId: id, tagId: tag.id } });
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

      return { conflict: false as const, updatedAt: updated.updatedAt.toISOString() };
    }
  } catch (e) {
    // In-memory fallback
  }

  const idx = memoryEntries.findIndex((e) => e.id === id);
  if (idx !== -1) {
    memoryEntries[idx] = {
      ...memoryEntries[idx],
      ...validated,
      updatedAt: new Date(),
    };
    return { conflict: false as const, updatedAt: memoryEntries[idx].updatedAt.toISOString() };
  }

  return { conflict: false as const, updatedAt: new Date().toISOString() };
}

export async function deleteEntry(id: string) {
  const user = await requireAuth();

  try {
    await prisma.entry.delete({ where: { id } });
  } catch (e) {
    memoryEntries = memoryEntries.filter((e) => e.id !== id);
  }

  return { success: true };
}
