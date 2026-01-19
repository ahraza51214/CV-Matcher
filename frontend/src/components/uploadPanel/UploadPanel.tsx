// Collects CV and JD files then triggers evaluation when both are ready.
import { Dropzone } from "./Dropzone";
import { FilePill } from "./FilePill";
import { EvaluateButton } from "./EvaluateButton";
import { ExportButton } from "./ExportButton";

const ACCEPT = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function UploadPanel({
  cvFile,
  jdFile,
  onCv,
  onJd,
  onEvaluate,
  onExport,
  exportDisabled,
  loading,
}: {
  cvFile: File | null;
  jdFile: File | null;
  onCv: (f: File | null) => void;
  onJd: (f: File | null) => void;
  onEvaluate: () => void;
  onExport: () => void;
  exportDisabled: boolean;
  loading?: boolean;
}) {
  const ready = !!cvFile && !!jdFile;
  const disabled = !ready || !!loading;

  return (
    <div className="upload-panel">
      <p className="eyebrow upload-panel__eyebrow">Candidate AI Job Matcher</p>
      <p className="upload-panel__description muted">
        Upload candidate CV and job description here. Drag & drop or click to browse.
      </p>

      {/* CV picker */}
      <Dropzone
        label="CV (PDF/DOCX)"
        dropText="Select Candidate"
        accept={ACCEPT}
        onPick={onCv}
      >
        {cvFile && <FilePill file={cvFile} onClear={() => onCv(null)} />}
      </Dropzone>

      <div className="spacer spacer--md" />

      {/* Job description picker */}
      <Dropzone
        label="Job Description (PDF/DOCX)"
        dropText="Select Job Description"
        accept={ACCEPT}
        onPick={onJd}
      >
        {jdFile && <FilePill file={jdFile} onClear={() => onJd(null)} />}
      </Dropzone>
      {/* Trigger evaluation when both files are ready */}
      <div className="upload-actions">
        <EvaluateButton disabled={disabled} loading={loading} onClick={onEvaluate} />
        <ExportButton disabled={exportDisabled} onClick={onExport} />
      </div>
    </div>
  );
}
