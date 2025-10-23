export function SectionCard({ title, items }: { title: string; items: string[] }) {
  const safe = Array.isArray(items) ? items : [];
  return (
    <div className="bordered section-card">
      <div className="muted section-card__title">{title}</div>
      {safe.length === 0 ? (
        <div className="muted section-card__empty">—</div>
      ) : (
        <ul className="section-card__list">
          {safe.map((t, i) => <li key={`${title}-${i}`}>{t}</li>)}
        </ul>
      )}
    </div>
  );
}
