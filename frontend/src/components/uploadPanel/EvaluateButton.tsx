// Primary CTA for triggering evaluation with loading/disabled states.
export function EvaluateButton({
  disabled,
  onClick,
  loading,
}: {
  disabled: boolean;
  onClick: () => void;
  loading?: boolean;
}) {
  const isDisabled = disabled || !!loading;

  return (
    <div className="evaluate-button">
      <button
        className={`btn primary big-btn${isDisabled ? " big-btn-disabled" : ""}`}
        disabled={isDisabled}
        onClick={onClick}
      >
        {loading ? "Evaluating…" : "Evaluate"}
      </button>
    </div>
  );
}
