import { motion, AnimatePresence } from "framer-motion";
import type { MatchResponse } from "../api/match";

export function ResultPanel({
  result,
  loading,
  error,
}: {
  result: MatchResponse | null;
  loading: boolean;
  error: string | null;
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
          {loading && !error && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="thinking-wrap"
              style={{ minHeight: 180 }}
            >
              <div className="thinking-orb">
                <motion.span className="thinking-dot" animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }} />
                <motion.span className="thinking-dot" animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} />
                <motion.span className="thinking-dot" animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
              </div>
              <div className="thinking-text">Thinking…</div>
            </motion.div>
          )}

          {hasResult && (
            <motion.div
              key="score"
              className="score-bubble"
              initial={{ top: "50%", left: "50%", x: "-50%", y: "-50%", opacity: 0, scale: 1 }}
              animate={{ top: 8, left: 8, x: 0, y: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              style={{ background: bg, borderColor: border, color: text }}
            >
              <div className="score-number">
                {score}
                <span className="score-denom">/100</span>
              </div>
              <div className="score-label">{band}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENT */}
        <div style={{ display: "grid", gap: 12 }}>
          {/* Only the FIRST block (reasoning) shifts right to clear the bubble */}
          {hasResult && result?.reasoning && (
            <div
              className="bordered"
              style={{
                padding: 12,
                marginLeft: 140,     // ⬅️ shift just this block
                marginTop: 6,
              }}
            >
              {result.reasoning}
            </div>
          )}

          {/* Pros — FULL WIDTH */}
          {hasResult && <SectionCard title="Pros" items={result?.pros || []} />}

          {/* Cons — FULL WIDTH */}
          {hasResult && <SectionCard title="Cons" items={result?.cons || []} />}

          {/* Idle text */}
          {!loading && !error && !hasResult && (
            <div className="muted" style={{ marginTop: 8 }}>Ready when you are.</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Subcomponents ---- */

function SectionCard({ title, items }: { title: string; items: string[] }) {
  const safe = Array.isArray(items) ? items : [];
  return (
    <div className="bordered" style={{ padding: 12 }}>
      <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>{title}</div>
      {safe.length === 0 ? (
        <div className="muted">—</div>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
          {safe.map((t, i) => <li key={`${title}-${i}`}>{t}</li>)}
        </ul>
      )}
    </div>
  );
}

/* ---- Helpers ---- */

function clamp0to100(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

type ScoreStyle = { band: string; bg: string; border: string; text: string };

function scoreStyle(score: number): ScoreStyle {
  if (score >= 75) return { band: "Great", bg: "#1db954", border: "#19a54a", text: "#08140d" };  // green
  if (score >= 50) return { band: "Fair",  bg: "#f5c518", border: "#e0b515", text: "#1a1400" };  // yellow
  return { band: "Poor",  bg: "#ff4d4f", border: "#e04345", text: "#140607" };                    // red
}
