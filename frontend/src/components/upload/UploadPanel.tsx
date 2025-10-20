import { Dropzone } from "./Dropzone";
import { FilePill } from "./FilePill";

const ACCEPT = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function UploadPanel({
  cvFile, jdFile, onCv, onJd, onEvaluate, loading
}:{
  cvFile: File|null; jdFile: File|null;
  onCv: (f:File|null)=>void; onJd: (f:File|null)=>void;
  onEvaluate: ()=>void; loading?: boolean;
}) {
  const ready = !!cvFile && !!jdFile;
  return (
    <div style={{ padding: 24 }}>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Your inputs</h3>
      <p className="muted" style={{ marginTop: 6, marginBottom: 20 }}>
        Upload <b>PDF/DOCX</b> for both CV and Job Description. Drag & drop or click to browse.
      </p>

      <Dropzone label="CV (PDF/DOCX)" accept={ACCEPT}
        onPick={onCv}>{cvFile && <FilePill file={cvFile} onClear={()=>onCv(null)} />}</Dropzone>

      <div style={{ height: 16 }} />

      <Dropzone label="Job Description (PDF/DOCX)" accept={ACCEPT}
        onPick={onJd}>{jdFile && <FilePill file={jdFile} onClear={()=>onJd(null)} />}</Dropzone>

      <div className="hint" style={{ marginTop: 10 }}>
        Tip: You can press <span className="kbd">Enter</span> on a dropzone to open the file picker.
      </div>

      {/* Big centered CTA */}
      <div style={{ display:"grid", placeItems:"center", marginTop:24 }}>
        <button className={`btn primary big-btn ${!ready ? "big-btn-disabled":""}`}
                disabled={!ready || !!loading} onClick={onEvaluate}>
          {loading ? "Evaluating…" : "Evaluate"}
        </button>
      </div>
    </div>
  );
}
