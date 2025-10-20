import { Paperclip, X } from "lucide-react";

export function FilePill({ file, onClear }: { file: File; onClear: () => void }) {
  const size = formatSize(file.size);
  return (
    <div className="file-pill">
      <div className="file-left">
        <div className="file-icon"><Paperclip size={16} /></div>
        <div className="file-name" title={file.name}>{file.name}</div>
        <div className="file-size">{size}</div>
      </div>
      <button className="file-x" onClick={(e)=>{ e.stopPropagation(); onClear(); }}>
        <X size={14}/>
      </button>
    </div>
  );
}
function formatSize(bytes:number){
  if(bytes<1024) return `${bytes} B`;
  const kb = bytes/1024; if(kb<1024) return `${kb.toFixed(1)} KB`;
  const mb = kb/1024; return `${mb.toFixed(1)} MB`;
}
