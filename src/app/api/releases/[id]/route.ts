import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { RELEASE_STEPS } from "@/lib/steps";

// GET single release by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const release = await prisma.release.findUnique({
    where: { id },
  });

  if (!release)
    return NextResponse.json({ error: "Release not found" }, { status: 404 });

  return NextResponse.json(release);
}

// PATCH to update steps / info
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  const { completedSteps = [], additionalInfo = "" } = body;

  const status =
    completedSteps.length === 0
      ? "planned"
      : completedSteps.length === RELEASE_STEPS.length
      ? "done"
      : "ongoing";

  const updated = await prisma.release.update({
    where: { id },
    data: { completedSteps, additionalInfo, status },
  });

  return NextResponse.json(updated);
}

// DELETE release
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.release.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}