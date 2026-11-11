"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createTripSchema, updateTripSchema, type CreateTripInput, type UpdateTripInput } from "@/schemas/trip";
import { revalidatePath } from "next/cache";

// In-memory fallback store when PostgreSQL / Supabase is not yet connected
let memoryTrips: any[] = [
  {
    id: "sample-trip-1",
    userId: "00000000-0000-0000-0000-000000000001",
    title: "Kyoto Autumn Whispers",
    startDate: new Date("2024-10-12"),
    endDate: new Date("2024-10-26"),
    coverMediaId: null,
    createdAt: new Date("2024-10-12"),
    _count: { entries: 1 },
    entries: [
      {
        id: "sample-entry-1",
        tripId: "sample-trip-1",
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
      },
    ],
  },
];

export async function getTrips() {
  const user = await requireAuth();

  try {
    return await prisma.trip.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    // Database fallback
    return memoryTrips.filter((t) => t.userId === user.id || user.id === "00000000-0000-0000-0000-000000000001");
  }
}

export async function getTrip(id: string) {
  const user = await requireAuth();

  try {
    return await prisma.trip.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        entries: {
          orderBy: { date: "asc" },
          include: {
            tags: {
              include: { tag: true },
            },
            media: {
              orderBy: { position: "asc" },
            },
          },
        },
      },
    });
  } catch (e) {
    // Fallback
    const found = memoryTrips.find((t) => t.id === id);
    return found || null;
  }
}

export async function createTrip(input: CreateTripInput) {
  const user = await requireAuth();
  const validated = createTripSchema.parse(input);

  try {
    const trip = await prisma.trip.create({
      data: {
        userId: user.id,
        title: validated.title,
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        coverMediaId: validated.coverMediaId || null,
      },
    });
    revalidatePath("/trips");
    return trip;
  } catch (e) {
    // Fallback in-memory
    const newTrip = {
      id: `trip-${Date.now()}`,
      userId: user.id,
      title: validated.title,
      startDate: validated.startDate ? new Date(validated.startDate) : null,
      endDate: validated.endDate ? new Date(validated.endDate) : null,
      coverMediaId: validated.coverMediaId || null,
      createdAt: new Date(),
      _count: { entries: 0 },
      entries: [],
    };
    memoryTrips.unshift(newTrip);
    revalidatePath("/trips");
    return newTrip;
  }
}

export async function updateTrip(id: string, input: UpdateTripInput) {
  const user = await requireAuth();
  const validated = updateTripSchema.parse(input);

  try {
    const existing = await prisma.trip.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      throw new Error("Volume not found or access denied");
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        ...(validated.title !== undefined && { title: validated.title }),
        ...(validated.startDate !== undefined && {
          startDate: validated.startDate ? new Date(validated.startDate) : null,
        }),
        ...(validated.endDate !== undefined && {
          endDate: validated.endDate ? new Date(validated.endDate) : null,
        }),
        ...(validated.coverMediaId !== undefined && {
          coverMediaId: validated.coverMediaId,
        }),
      },
    });

    revalidatePath("/trips");
    revalidatePath(`/trips/${id}`);
    return updated;
  } catch (e) {
    const idx = memoryTrips.findIndex((t) => t.id === id);
    if (idx !== -1) {
      memoryTrips[idx] = {
        ...memoryTrips[idx],
        ...validated,
      };
      return memoryTrips[idx];
    }
    throw new Error("Volume not found");
  }
}

export async function deleteTrip(id: string) {
  const user = await requireAuth();

  try {
    const existing = await prisma.trip.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      throw new Error("Volume not found or access denied");
    }

    await prisma.trip.delete({
      where: { id },
    });
  } catch (e) {
    memoryTrips = memoryTrips.filter((t) => t.id !== id);
  }

  revalidatePath("/trips");
  return { success: true };
}
