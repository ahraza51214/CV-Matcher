import { Upload } from "lucide-react";
import { useRef, useState, useCallback } from "react";

type Props = {
  label: string;
  onPick: (file: File | null) => void;
  accept: string;
  children?: React.ReactNode; // e.g., FilePill
};

export function Dropzone({ label, onPick, accept, children }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(false);
  const pick = () => inputRef.current?.click();

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setActive(false);
    onPick(e.dataTransfer.files?.[0] ?? null);
  }, [onPick]);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label className="muted" style={{ fontSize: 12 }}>{label}</label>
      <div
        className={`dz ${active ? "active" : ""}`}
        onDragEnter={(e)=>{e.preventDefault(); setActive(true);}}
        onDragOver={(e)=>{e.preventDefault(); setActive(true);}}
        onDragLeave={(e)=>{e.preventDefault(); setActive(false);}}
        onDrop={onDrop}
        onClick={pick}
        role="button"
        tabIndex={0}
        onKeyDown={(e)=> (e.key === "Enter" || e.key === " ") && pick()}
      >
        {children ?? (
          <div className="dz-inner">
            <div className="dz-icon"><Upload size={18}/></div>
            <div className="dz-title">Drop file here</div>
            <div className="dz-sub">or <span className="linklike">click to browse</span></div>
          </div>
        )}
        <input ref={inputRef} type="file" accept={accept} style={{display:"none"}}
               onChange={(e)=> onPick(e.target.files?.[0] ?? null)} />
      </div>
    </div>
  );
}
