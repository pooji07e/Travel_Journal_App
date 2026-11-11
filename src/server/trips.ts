"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createTripSchema, updateTripSchema, type CreateTripInput, type UpdateTripInput } from "@/schemas/trip";
import { revalidatePath } from "next/cache";

export async function getTrips() {
  const user = await requireAuth();

  return prisma.trip.findMany({
    where: { userId: user.id },
    include: {
      _count: {
        select: { entries: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTrip(id: string) {
  const user = await requireAuth();

  return prisma.trip.findFirst({
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
}

export async function createTrip(input: CreateTripInput) {
  const user = await requireAuth();
  const validated = createTripSchema.parse(input);

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
}

export async function updateTrip(id: string, input: UpdateTripInput) {
  const user = await requireAuth();
  const validated = updateTripSchema.parse(input);

  // Verify ownership
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
}

export async function deleteTrip(id: string) {
  const user = await requireAuth();

  const existing = await prisma.trip.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    throw new Error("Volume not found or access denied");
  }

  await prisma.trip.delete({
    where: { id },
  });

  revalidatePath("/trips");
  return { success: true };
}
