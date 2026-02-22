// src/app/releases/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReleaseDetailClient from "./ReleaseDetailClient";
import { RELEASE_STEPS } from "@/lib/steps";

export default async function ReleaseDetailPage({ params }: { params: { id: string } }) {
  const releaseId = params.id;
  if (!releaseId) return notFound(); // fallback if undefined

  const release = await prisma.release.findUnique({
    where: { id: releaseId },
  });

  if (!release) return notFound();

  const completed = release.completedSteps?.length ?? 0;
  const status =
    completed === 0
      ? "planned"
      : completed === RELEASE_STEPS.length
      ? "done"
      : "ongoing";

  // Pass data to Client Component
  return <ReleaseDetailClient release={release} status={status} />;
}