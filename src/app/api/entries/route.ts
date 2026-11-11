import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createEntrySchema } from "@/schemas/entry";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Sign in required" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const tripId = searchParams.get("tripId");
  const cursor = searchParams.get("cursor");
  const limitParam = parseInt(searchParams.get("limit") || "10", 10);
  const limit = Math.min(Math.max(limitParam, 1), 50);

  try {
    const entries = await prisma.entry.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        userId: user.id,
        ...(tripId && { tripId }),
      },
      orderBy: { date: "desc" },
      include: {
        tags: { include: { tag: true } },
        media: { take: 1, orderBy: { position: "asc" } },
      },
    });

    let nextCursor: string | null = null;
    if (entries.length > limit) {
      const nextItem = entries.pop();
      nextCursor = nextItem ? nextItem.id : null;
    }

    return NextResponse.json({
      data: entries,
      nextCursor,
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch pages" } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Sign in required" } },
      { status: 401 }
    );
  }

  try {
    const json = await request.json();
    const validated = createEntrySchema.parse(json);

    // Verify trip ownership
    const trip = await prisma.trip.findFirst({
      where: { id: validated.tripId, userId: user.id },
    });

    if (!trip) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Volume not found or unauthorized" } },
        { status: 404 }
      );
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
            where: { userId_name: { userId: user.id, name: cleanName } },
            update: {},
            create: { userId: user.id, name: cleanName },
          });

          await tx.entryTag.create({
            data: { entryId: newEntry.id, tagId: tag.id },
          });
        }
      }

      return newEntry;
    });

    return NextResponse.json({ data: entry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.message || "Invalid input" } },
      { status: 400 }
    );
  }
}
