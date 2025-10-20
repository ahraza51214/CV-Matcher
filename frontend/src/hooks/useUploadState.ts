import { useState } from "react";

export function useUploadState() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const ready = !!cvFile && !!jdFile;
  return { cvFile, jdFile, setCvFile, setJdFile, ready };
}
