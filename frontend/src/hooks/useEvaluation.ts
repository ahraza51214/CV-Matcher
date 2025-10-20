import { useState } from "react";
import type { Provider, MatchResponse } from "../api/types";
import { evaluateUpload } from "../api/match";
import { getErrorMessage } from "../utils/errors";

export function useEvaluation(provider: Provider) {
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  async function run(cv: File | null, jd: File | null) {
    setError(null); setResult(null); setStarted(true); setLoading(true);
    try {
      if (!cv || !jd) throw new Error("Please upload both CV and Job Description (PDF/DOCX).");
      const r = await evaluateUpload(provider, cv, jd);
      setResult(r);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, started, run };
}
