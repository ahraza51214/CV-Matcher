import { useCallback, useRef, useState } from "react";
import { Paperclip, X, Upload } from "lucide-react";

type Props = {
  cvFile: File | null;
  jdFile: File | null;
  onCvFileChange: (f: File | null) => void;
  onJdFileChange: (f: File | null) => void;
  onEvaluate: () => void;
  loading?: boolean;
};

export function UploadCard({
  cvFile, jdFile,
  onCvFileChange, onJdFileChange,
  onEvaluate, loading
}: Props) {
  const cvInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);

  const [cvActive, setCvActive] = useState(false);
  const [jdActive, setJdActive] = useState(false);

  const pickCv = () => cvInputRef.current?.click();
  const pickJd = () => jdInputRef.current?.click();

  const onDropCv = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setCvActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onCvFileChange(f);
  }, [onCvFileChange]);

  const onDropJd = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setJdActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onJdFileChange(f);
  }, [onJdFileChange]);

  const accept =
    ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  const ready = !!cvFile && !!jdFile;

  return (
    <div style={{ padding: 24 }}>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Your inputs</h3>
      <p className="muted" style={{ marginTop: 6, marginBottom: 20 }}>
        Upload <b>PDF/DOCX</b> for both CV and Job Description. Drag & drop or click to browse.
      </p>

      {/* CV */}
      <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
        <label className="muted" style={{ fontSize: 12 }}>CV (PDF/DOCX)</label>
        <div
          className={`dz ${cvActive ? "active" : ""}`}
          onDragEnter={(e)=>{e.preventDefault(); setCvActive(true);}}
          onDragOver={(e)=>{e.preventDefault(); setCvActive(true);}}
          onDragLeave={(e)=>{e.preventDefault(); setCvActive(false);}}
          onDrop={onDropCv}
          onClick={pickCv}
          role="button"
          aria-label="Upload CV"
          tabIndex={0}
          onKeyDown={(e)=> (e.key === "Enter" || e.key === " ") && pickCv()}
        >
          {!cvFile ? (
            <div className="dz-inner">
              <div className="dz-icon"><Upload size={18} /></div>
              <div className="dz-title">Drop your CV here</div>
              <div className="dz-sub">or <span className="linklike">click to browse</span></div>
            </div>
          ) : (
            <FilePill file={cvFile} onClear={() => onCvFileChange(null)} />
          )}
          <input
            ref={cvInputRef}
            type="file"
            accept={accept}
            style={{ display: "none" }}
            onChange={(e) => onCvFileChange(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      {/* JD */}
      <div style={{ display: "grid", gap: 8 }}>
        <label className="muted" style={{ fontSize: 12 }}>Job Description (PDF/DOCX)</label>
        <div
          className={`dz ${jdActive ? "active" : ""}`}
          onDragEnter={(e)=>{e.preventDefault(); setJdActive(true);}}
          onDragOver={(e)=>{e.preventDefault(); setJdActive(true);}}
          onDragLeave={(e)=>{e.preventDefault(); setJdActive(false);}}
          onDrop={onDropJd}
          onClick={pickJd}
          role="button"
          aria-label="Upload Job Description"
          tabIndex={0}
          onKeyDown={(e)=> (e.key === "Enter" || e.key === " ") && pickJd()}
        >
          {!jdFile ? (
            <div className="dz-inner">
              <div className="dz-icon"><Upload size={18} /></div>
              <div className="dz-title">Drop the JD here</div>
              <div className="dz-sub">or <span className="linklike">click to browse</span></div>
            </div>
          ) : (
            <FilePill file={jdFile} onClear={() => onJdFileChange(null)} />
          )}
          <input
            ref={jdInputRef}
            type="file"
            accept={accept}
            style={{ display: "none" }}
            onChange={(e) => onJdFileChange(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <div className="hint" style={{ marginTop: 10 }}>
        Tip: You can press <span className="kbd">Enter</span> on a dropzone to open the file picker.
      </div>

      {/* Big centered CTA */}
      <div style={{ display: "grid", placeItems: "center", marginTop: 24 }}>
        <button
          className={`btn primary big-btn ${ready ? "" : "big-btn-disabled"}`}
          onClick={onEvaluate}
          disabled={loading || !ready}
        >
          {loading ? "Evaluating…" : "Evaluate"}
        </button>
      </div>
    </div>
  );
}

function FilePill({ file, onClear }: { file: File; onClear: () => void }) {
  const size = formatSize(file.size);
  return (
    <div className="file-pill">
      <div className="file-left">
        <div className="file-icon"><Paperclip size={16} /></div>
        <div className="file-name" title={file.name}>{file.name}</div>
        <div className="file-size">{size}</div>
      </div>
      <button
        className="file-x"
        onClick={(e)=>{ e.stopPropagation(); onClear(); }}
        aria-label="Remove file"
        title="Remove file"
      >
        <X size={14}/>
      </button>
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}
