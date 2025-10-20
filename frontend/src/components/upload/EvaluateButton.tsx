export function EvaluateButton({ disabled, onClick, loading }:{
  disabled: boolean; onClick: ()=>void; loading?: boolean;
}) {
  return (
    <div style={{ display:"grid", placeItems:"center", marginTop: 24 }}>
      <button className={`btn primary big-btn ${disabled ? "big-btn-disabled" : ""}`}
              disabled={disabled} onClick={onClick}>
        {loading ? "Evaluating…" : "Evaluate"}
      </button>
    </div>
  );
}
