// src/app/releases/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReleaseDetailClient from "./ReleaseDetailClient";
import { RELEASE_STEPS } from "@/lib/steps";

interface Release {
  id: string;
  name: string;
  date: string;
  additionalInfo: string;
  completedSteps: string[];
}

interface Props {
  params: Promise<{ id: string }>; // <- params is a Promise in App Router
}

export default async function ReleaseDetailPage({ params }: Props) {
  const { id: releaseId } = await params; // ✅ unwrap promise
  if (!releaseId) return notFound();

  const release: Release | null = await prisma.release.findUnique({
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

  return <ReleaseDetailClient release={release} status={status} />;
}