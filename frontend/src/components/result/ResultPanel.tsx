import { AnimatePresence } from "framer-motion";
import type { MatchResponse } from "../../api/types";
import { clamp0to100, scoreStyle } from "../../utils/score";
import { Thinking } from "./Thinking";
import { ScoreBubble } from "./ScoreBubble";
import { SectionCard } from "./SectionCard";

export function ResultPanel({
  result, loading, error, onClose,
}: {
  result: MatchResponse | null;
  loading: boolean;
  error: string | null;
  onClose?: () => void;
}) {
  const hasResult = !!result && !loading && !error;
  const score = hasResult ? clamp0to100(result!.matchScore) : 0;
  const { bg, border, text, band } = scoreStyle(score);

  return (
    <div className="result-panel">
      {/* Close button identical to file “x” */}
      {onClose && (
        <button
          type="button"
          className="file-x panel-x"
          aria-label="Close result"
          onClick={onClose}
        >
          ×
        </button>
      )}

      <h3 className="result-panel__title">AI Match Result</h3>
      {error && <div className="result-panel__error">Error: {error}</div>}

      <div className="result-panel__body">
        <AnimatePresence mode="popLayout">
          {loading && !error && <Thinking />}
          {hasResult && (
            <ScoreBubble bg={bg} border={border} text={text} score={score} band={band} />
          )}
        </AnimatePresence>

        <div className="result-panel__sections">
          {hasResult && result?.reasoning && (
            <div className="bordered section-card result-panel__reasoning">
              <div className="muted section-card__title">Summary</div>
              <p className="section-card__text">{result.reasoning}</p>
            </div>
          )}
          {hasResult && <SectionCard title="Pros" items={result?.pros || []} />}
          {hasResult && <SectionCard title="Cons" items={result?.cons || []} />}
          {!loading && !error && !hasResult && (
            <div className="muted result-panel__placeholder">Ready when you are.</div>
          )}
        </div>
      </div>
    </div>
  );
}
