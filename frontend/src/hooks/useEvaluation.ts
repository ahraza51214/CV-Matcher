// Handles evaluation lifecycle: submission, loading/error state, and dismissal.
import { useState } from "react";
import type { Provider, MatchResponse } from "../api/types";
import { evaluateUpload } from "../api/match";
import { getErrorMessage } from "../utils/errors";

/**
 * Manages evaluation lifecycle:
 * - run(): starts evaluation (sets started=true, handles loading/result/error)
 * - dismiss(): closes results and resets UI back to the centered upload panel
 */
export function useEvaluation(provider: Provider) {
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  async function run(cv: File | null, jd: File | null) {
    // Reset state and start spinner each time we run.
    setError(null);
    setResult(null);
    setStarted(true);
    setLoading(true);

    try {
      if (!cv || !jd) {
        throw new Error("Please upload both CV and Job Description (PDF/DOCX).");
      }
      // Call backend match endpoint and store response.
      const r = await evaluateUpload(provider, cv, jd);
      setResult(r);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  /** Close the result panel and restore the initial (centered) layout */
  function dismiss() {
    // Clear all transient state so UI returns to upload-only view.
    setLoading(false);
    setResult(null);
    setError(null);
    setStarted(false);
  }

  // Backward compatible: existing callers still get the same fields; `dismiss` is additive.
  return { result, loading, error, started, run, dismiss };
}
