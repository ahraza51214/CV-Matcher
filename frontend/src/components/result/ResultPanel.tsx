import { AnimatePresence } from "framer-motion";
import type { MatchResponse } from "../../api/types";
import { clamp0to100, scoreStyle } from "../../utils/score";
import { Thinking } from "./Thinking";
import { ScoreBubble } from "./ScoreBubble";
import { SectionCard } from "./SectionCard";

export function ResultPanel({ result, loading, error }:{
  result: MatchResponse | null; loading: boolean; error: string | null;
}) {
  const hasResult = !!result && !loading && !error;
  const score = hasResult ? clamp0to100(result!.matchScore) : 0;
  const { bg, border, text, band } = scoreStyle(score);

  return (
    <div style={{ padding: 24, position: "relative", minHeight: 320, overflow: "hidden" }}>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>Match Result</h3>
      {error && <div style={{ color: "#ff9aa2" }}>Error: {error}</div>}

      <div style={{ position: "relative" }}>
        <AnimatePresence mode="popLayout">
          {loading && !error && <Thinking />}
          {hasResult && (
            <ScoreBubble bg={bg} border={border} text={text} score={score} band={band} />
          )}
        </AnimatePresence>

        {/* Only first block needs left offset, pros/cons full width */}
        <div style={{ display:"grid", gap:12 }}>
          {hasResult && result?.reasoning && (
            <div className="bordered" style={{ padding: 12, marginLeft: 140, marginTop: 6 }}>
              {result.reasoning}
            </div>
          )}
          {hasResult && <SectionCard title="Pros" items={result?.pros || []} />}
          {hasResult && <SectionCard title="Cons" items={result?.cons || []} />}
          {!loading && !error && !hasResult && <div className="muted" style={{ marginTop: 8 }}>Ready when you are.</div>}
        </div>
      </div>
    </div>
  );
}
