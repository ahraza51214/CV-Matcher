export type Provider = "OpenAI" | "Gemini";

export type MatchResponse = {
  matchScore: number;
  band: string;
  pros: string[];
  cons: string[];
  reasoning?: string | null;
  meta?: Record<string, unknown>;
};
