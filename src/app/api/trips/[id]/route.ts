import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateTripSchema } from "@/schemas/trip";

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

  const trip = await prisma.trip.findFirst({
    where: { id: params.id, userId: user.id },
    include: {
      entries: {
        orderBy: { date: "asc" },
      },
    },
  });

  if (!trip) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Volume not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: trip });
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
    const validated = updateTripSchema.parse(json);

    const existing = await prisma.trip.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Volume not found" } },
        { status: 404 }
      );
    }

    const updated = await prisma.trip.update({
      where: { id: params.id },
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

    return NextResponse.json({ data: updated });
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

  const existing = await prisma.trip.findFirst({
    where: { id: params.id, userId: user.id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Volume not found" } },
      { status: 404 }
    );
  }

  await prisma.trip.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ data: { success: true } });
}
