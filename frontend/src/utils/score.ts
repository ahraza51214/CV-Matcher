 export function clamp0to100(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export type ScoreStyle = { band: string; bg: string; border: string; text: string };

export function scoreStyle(score: number): ScoreStyle {
  if (score >= 75) return { band: "Great", bg: "#1db954", border: "#19a54a", text: "#08140d" };
  if (score >= 50) return { band: "Fair",  bg: "#f5c518", border: "#e0b515", text: "#1a1400" };
  return { band: "Poor",  bg: "#ff4d4f", border: "#e04345", text: "#140607" };
}
