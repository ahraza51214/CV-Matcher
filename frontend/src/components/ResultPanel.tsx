import type { MatchResponse } from "../api/types";

type Props = { data: MatchResponse };

export default function ResultPanel({ data }: Props) {
  const color =
    data.matchScore >= 85 ? "#16a34a" :
    data.matchScore >= 70 ? "#22c55e" :
    data.matchScore >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 style={{ margin: 0 }}>Match Result</h2>
        <div style={{ fontSize: 28, fontWeight: 800, color }}>
          {data.matchScore}/100 <span style={{ fontSize: 16, color: "#64748b", fontWeight: 600 }}>({data.band})</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 10 }}>
        <div>
          <h3 style={{ marginTop: 0 }}>Pros</h3>
          <ul>{data.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
        <div>
          <h3 style={{ marginTop: 0 }}>Cons</h3>
          <ul>{data.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </div>
      </div>

      {data.missingSkills?.length > 0 && (
        <>
          <h3>Missing skills</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {data.missingSkills.map((m, i) => (
              <span key={i} style={{ padding: "4px 8px", background: "#eef2ff", borderRadius: 8 }}>{m}</span>
            ))}
          </div>
        </>
      )}

      <h3>Breakdown</h3>
      <ul style={{ columns: 2, marginTop: 0 }}>
        {Object.entries(data.explanations).map(([k, v]) => (
          <li key={k}>{k}: {v}</li>
        ))}
      </ul>
    </div>
  );
}
