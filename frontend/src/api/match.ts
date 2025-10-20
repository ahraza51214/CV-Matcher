import { BASE_URL } from "./client";

export type Provider = "OpenAI" | "Gemini";

export type MatchResponse = {
  matchScore: number;
  band: string;
  pros: string[];
  cons: string[];
  reasoning?: string | null;
  meta?: Record<string, number>;
};

export async function evaluateUpload(
  provider: Provider,
  cvFile: File,
  jdFile: File
): Promise<MatchResponse> {
  const fd = new FormData();
  fd.append("cv", cvFile);
  fd.append("jd", jdFile);

  const url = `${BASE_URL}/match?provider=${encodeURIComponent(provider)}`;
  const res = await fetch(url, { method: "POST", body: fd });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
