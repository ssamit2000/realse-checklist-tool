// src/app/releases/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { RELEASE_STEPS } from "@/lib/steps";
import { notFound } from "next/navigation";
import ReleaseDetailClient from "./ReleaseDetailClient";

interface Release {
  id: string;
  name: string;
  date: string;
  additionalInfo: string;
  completedSteps: string[];
}

interface Props {
  params: { id?: string }; // id optional
}

export default async function ReleaseDetailPage({ params }: Props) {
  const releaseId = params?.id; // ✅ unwrap safely
  if (!releaseId) return notFound(); // fallback

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

  return <ReleaseDetailClient release={release} status={status} /> ;
}