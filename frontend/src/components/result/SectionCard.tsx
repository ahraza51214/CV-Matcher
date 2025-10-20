export function SectionCard({ title, items }: { title: string; items: string[] }) {
  const safe = Array.isArray(items) ? items : [];
  return (
    <div className="bordered" style={{ padding: 12 }}>
      <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>{title}</div>
      {safe.length === 0 ? <div className="muted">—</div> : (
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
          {safe.map((t, i) => <li key={`${title}-${i}`}>{t}</li>)}
        </ul>
      )}
    </div>
  );
}
