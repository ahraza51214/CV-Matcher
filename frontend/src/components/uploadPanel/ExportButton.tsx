// Secondary CTA to export a 360-degree candidate PDF view.
type ExportButtonProps = {
  disabled: boolean;
  onClick: () => void;
};

export function ExportButton({ disabled, onClick }: ExportButtonProps) {
  return (
    <button
      type="button"
      className={`btn big-btn btn-success${disabled ? " big-btn-disabled" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      Export 360° Candidate View
    </button>
  );
}
