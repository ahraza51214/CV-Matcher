import { useRef } from "react";

type Props = {
  onPickJD: (f: File) => void;
  onPickCV: (f: File) => void;
  onStart: () => void;
  disabled?: boolean;
};

export default function UploadCard({ onPickJD, onPickCV, onStart, disabled }: Props) {
  const jdRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  return (
    <div className="card">
      <h1>Upload Documents</h1>

      {/* JD row */}
      <div className="field">
        <div className="icon">⬆️</div>
        <label>Job Description (PDF/DOCX)</label>
        <input
          ref={jdRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => e.target.files?.[0] && onPickJD(e.target.files[0])}
        />
        <button className="browse" onClick={() => jdRef.current?.click()} type="button">Browse</button>
      </div>

      {/* CV row */}
      <div className="field">
        <div className="icon">👤</div>
        <label>Candidate CV (PDF/DOCX)</label>
        <input
          ref={cvRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => e.target.files?.[0] && onPickCV(e.target.files[0])}
        />
        <button className="browse" onClick={() => cvRef.current?.click()} type="button">Browse</button>
      </div>

      <button className="cta" disabled={disabled} onClick={onStart} type="button">
        Start AI Match Scoring
      </button>
    </div>
  );
}
