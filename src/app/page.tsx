import Link from "next/link";

function computeStatus(steps: Record<string, boolean>) {
  const values = Object.values(steps);
  const completed = values.filter(Boolean).length;

  if (completed === 0) return "planned";
  if (completed === values.length) return "done";
  return "ongoing";
}

async function getReleases() {
  const res = await fetch("http://localhost:3000/api/releases", {
    cache: "no-store"
  });
  return res.json();
}

export default async function HomePage() {
  const releases = await getReleases();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Release Checklist</h1>

      <Link href="/create">
        <button style={{ marginBottom: "1rem" }}>
          + Create New Release
        </button>
      </Link>

      {releases.length === 0 && <p>No releases yet.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {releases.map((release: any) => {
          const status = computeStatus(release.steps);

          return (
            <li
              key={release.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem"
              }}
            >
              <Link href={`/releases/${release.id}`}>
                <strong>{release.name}</strong>
              </Link>

              <div>Due: {new Date(release.date).toLocaleDateString()}</div>

              <div>
                Status:{" "}
                <strong
                  style={{
                    color:
                      status === "planned"
                        ? "gray"
                        : status === "ongoing"
                        ? "orange"
                        : "green"
                  }}
                >
                  {status}
                </strong>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}