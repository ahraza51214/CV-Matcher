// Shared API shapes for providers and match responses.
export type Provider = "ChatGPT" | "Gemini" | "Claude" | "Fusion";

export type MatchResponse = {
  matchScore: number;
  band: string;
  pros: string[];
  cons: string[];
  reasoning?: string | null;
  meta?: {
    jdText?: string;
    [key: string]: unknown;
  };
};
