import { Dropzone } from "./Dropzone";
import { FilePill } from "./FilePill";
import { EvaluateButton } from "./EvaluateButton";

const ACCEPT = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function UploadPanel({
  cvFile, jdFile, onCv, onJd, onEvaluate, loading,
}: {
  cvFile: File | null;
  jdFile: File | null;
  onCv: (f: File | null) => void;
  onJd: (f: File | null) => void;
  onEvaluate: () => void;
  loading?: boolean;
}) {
  const ready = !!cvFile && !!jdFile;
  const disabled = !ready || !!loading;

  return (
    <div className="upload-panel">
      <h3 className="upload-panel__title">Your inputs</h3>
      <p className="upload-panel__description muted">
        Upload <b>PDF/DOCX</b> for both CV and Job Description. Drag & drop or click to browse.
      </p>

      <Dropzone
        label="CV (PDF/DOCX)"
        dropText="Drop CV here"
        accept={ACCEPT}
        onPick={onCv}
      >
        {cvFile && <FilePill file={cvFile} onClear={() => onCv(null)} />}
      </Dropzone>

      <div className="spacer spacer--md" />

      <Dropzone
        label="Job Description (PDF/DOCX)"
        dropText="Drop job description here"
        accept={ACCEPT}
        onPick={onJd}
      >
        {jdFile && <FilePill file={jdFile} onClear={() => onJd(null)} />}
      </Dropzone>

      <div className="hint upload-panel__hint">
        Tip: You can press <span className="kbd">Enter</span> on a dropzone to open the file picker.
      </div>

      <EvaluateButton disabled={disabled} loading={loading} onClick={onEvaluate} />
    </div>
  );
}
