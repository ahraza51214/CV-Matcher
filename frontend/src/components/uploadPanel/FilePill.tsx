// Displays a selected file with size and a clear action inside the upload panel.
import { Paperclip, X } from "lucide-react";

import { formatFileSize } from "../../utils/fileSize";

type FilePillProps = {
  file: File;
  onClear: () => void;
};

export function FilePill({ file, onClear }: FilePillProps) {
  const size = formatFileSize(file.size);
  return (
    <div className="file-pill">
      <div className="file-left">
        <div className="file-icon"><Paperclip size={16} /></div>
        <div className="file-name" title={file.name}>{file.name}</div>
        <div className="file-size">{size}</div>
      </div>
      {/* Clear selection without opening the picker */}
      <button
        className="file-x"
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
        type="button"
      >
        <X size={14} />
      </button>
    </div>
  );
}
