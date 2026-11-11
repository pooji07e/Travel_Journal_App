import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createTripSchema } from "@/schemas/trip";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Sign in required" } },
      { status: 401 }
    );
  }

  try {
    const trips = await prisma.trip.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { entries: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: trips });
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch volumes" } },
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
    const validated = createTripSchema.parse(json);

    const trip = await prisma.trip.create({
      data: {
        userId: user.id,
        title: validated.title,
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        coverMediaId: validated.coverMediaId || null,
      },
    });

    return NextResponse.json({ data: trip }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.message || "Invalid input" } },
      { status: 400 }
    );
  }
}
