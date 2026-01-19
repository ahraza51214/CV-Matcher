// Visual bubble displaying match score with animated entrance.
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

import type { ScoreStyle } from "../../utils/scoreBubbleStyle";

type ScoreBubbleProps = {
  score: number;
  style: ScoreStyle;
};

export function ScoreBubble({ score, style }: ScoreBubbleProps) {
  const { bg, border, text, band } = style;
  return (
    <motion.div
      className="score-bubble score-bubble--modern"
      // Fly in from center on initial render.
      initial={{ top: "50%", left: "50%", x: "-50%", y: "-50%", opacity: 0, scale: 1 }}
      animate={{ top: 8, left: 8, x: 0, y: 0, opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
      style={{
        background: bg,
        borderColor: border,
        color: text,
        ["--sb-accent" as keyof CSSProperties]: border,
      }}
    >
      <div className="score-inner">
        <div className="score-number">
          {score}
          <span className="score-denom">/100</span>
        </div>
        <div className="score-label">{band}</div>
      </div>
    </motion.div>
  );
}
