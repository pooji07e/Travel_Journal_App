import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { patchEntrySchema } from "@/schemas/entry";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Sign in required" } },
      { status: 401 }
    );
  }

  const entry = await prisma.entry.findFirst({
    where: { id: params.id, userId: user.id },
    include: {
      tags: { include: { tag: true } },
      media: { orderBy: { position: "asc" } },
      trip: { select: { id: true, title: true } },
    },
  });

  if (!entry) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Page not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: entry });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Sign in required" } },
      { status: 401 }
    );
  }

  try {
    const json = await request.json();
    const validated = patchEntrySchema.parse(json);

    const existing = await prisma.entry.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Page not found" } },
        { status: 404 }
      );
    }

    // Conflict detection using updatedAt
    const clientTime = new Date(validated.updatedAt).getTime();
    const serverTime = existing.updatedAt.getTime();

    if (serverTime - clientTime > 500) {
      return NextResponse.json(
        {
          error: {
            code: "CONFLICT",
            message: "This entry was modified in another session. Please reload to avoid overwriting changes.",
          },
          serverUpdatedAt: existing.updatedAt.toISOString(),
        },
        { status: 409 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (validated.tags !== undefined) {
        await tx.entryTag.deleteMany({ where: { entryId: params.id } });
        for (const tagName of validated.tags) {
          const cleanName = tagName.trim().toLowerCase();
          if (!cleanName) continue;
          const tag = await tx.tag.upsert({
            where: { userId_name: { userId: user.id, name: cleanName } },
            update: {},
            create: { userId: user.id, name: cleanName },
          });
          await tx.entryTag.create({
            data: { entryId: params.id, tagId: tag.id },
          });
        }
      }

      return tx.entry.update({
        where: { id: params.id },
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

    return NextResponse.json({
      data: updated,
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.message || "Invalid input" } },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Sign in required" } },
      { status: 401 }
    );
  }

  const existing = await prisma.entry.findFirst({
    where: { id: params.id, userId: user.id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Page not found" } },
      { status: 404 }
    );
  }

  await prisma.entry.delete({ where: { id: params.id } });

  return NextResponse.json({ data: { success: true } });
}
