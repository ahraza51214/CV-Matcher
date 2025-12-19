export type Provider = "OpenAI" | "Gemini" | "Claude" | "Fusion";

export type MatchResponse = {
  matchScore: number;
  band: string;
  pros: string[];
  cons: string[];
  reasoning?: string | null;
  meta?: Record<string, unknown>;
};
