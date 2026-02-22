"use client";

import { useEffect, useState } from "react";
import { RELEASE_STEPS } from "@/lib/steps";

type Release = {
  id: string;
  name: string;
  date: string;
  status: string;
  additionalInfo: string;
  completedSteps: string[];
};

export default function ReleaseDetailPage({ params }: { params: { id: string } }) {
  const [release, setRelease] = useState<Release | null>(null);

  useEffect(() => {
    async function fetchRelease() {
      const res = await fetch(`/api/releases/${params.id}`);
      if (!res.ok) {
        console.error("Failed to fetch release", res.status);
        return;
      }
      const data = await res.json();
      setRelease(data);
    }
    fetchRelease();
  }, [params.id]);

  async function toggleStep(step: string) {
    if (!release) return;

    const updatedSteps = release.completedSteps.includes(step)
      ? release.completedSteps.filter((s) => s !== step)
      : [...release.completedSteps, step];

    const res = await fetch(`/api/releases/${release.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completedSteps: updatedSteps, additionalInfo: release.additionalInfo }),
    });
    const updated = await res.json();
    setRelease(updated);
  }

  async function updateInfo(info: string) {
    if (!release) return;

    const res = await fetch(`/api/releases/${release.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completedSteps: release.completedSteps, additionalInfo: info }),
    });
    const updated = await res.json();
    setRelease(updated);
  }

  async function deleteRelease() {
    if (!release) return;
    await fetch(`/api/releases/${release.id}`, { method: "DELETE" });
    window.location.href = "/";
  }

  if (!release) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{release.name}</h1>
      <p><strong>Due:</strong> {new Date(release.date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {release.status}</p>

      <hr />
      <h3>Steps</h3>
      {RELEASE_STEPS.map((step) => (
        <div key={step}>
          <label>
            <input
              type="checkbox"
              checked={release.completedSteps.includes(step)}
              onChange={() => toggleStep(step)}
            />
            {step}
          </label>
        </div>
      ))}

      <hr />
      <h3>Additional Info</h3>
      <textarea
        value={release.additionalInfo || ""}
        onChange={(e) => updateInfo(e.target.value)}
        rows={4}
        style={{ width: "100%" }}
      />

      <hr />
      <button
        onClick={deleteRelease}
        style={{ background: "red", color: "white", padding: "8px 12px", border: "none", cursor: "pointer" }}
      >
        Delete Release
      </button>
    </div>
  );
}