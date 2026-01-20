// Client for context explorer data (tools/options/content).
import type { ToolId } from "../components/contextExplorerPanel/types";

export type ContextTool = { id: ToolId; name: string };

export type ContextOption = {
  id: string;
  label: string;
  description?: string;
};

export type ContextContent = {
  toolId: ToolId;
  optionId: string;
  label: string;
  raw?: unknown;
  aiRendered?: string | null;
  updatedAt?: string;
};

export type ContextSummary = {
  toolId: ToolId;
  optionId: string;
  summary: string;
};
const BASE_URL = import.meta.env.VITE_CONTEXT_API_URL;
const ENABLED = import.meta.env.VITE_CONTEXT_API_ENABLED === "true";

async function safeFetch<T>(path: string): Promise<T | null> {
  if (!ENABLED || !BASE_URL) return null;
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (e) {
    console.warn("contextApi fetch failed", e);
    return null;
  }
}

export async function fetchTools(): Promise<ContextTool[]> {
  const live = await safeFetch<ContextTool[]>("/tools");
  return live ?? [];
}

export async function fetchOptions(toolId: ToolId): Promise<ContextOption[]> {
  const live = await safeFetch<ContextOption[]>(`/tools/${toolId}/options`);
  return live ?? [];
}

export async function fetchContent(toolId: ToolId, optionId: string): Promise<ContextContent | null> {
  const live = await safeFetch<ContextContent>(`/tools/${toolId}/options/${optionId}`);
  return live;
}

export async function fetchResonance(params: {
  toolId: ToolId;
  optionId: string;
  jdText: string;
  matchScore: number;
}): Promise<ContextSummary | null> {
  if (!ENABLED || !BASE_URL) return null;
  try {
    const { toolId, optionId, jdText, matchScore } = params;
    const res = await fetch(`${BASE_URL}/tools/${toolId}/options/${optionId}/resonance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jd_text: jdText, match_score: matchScore }),
    });
    if (!res.ok) return null;
    return (await res.json()) as ContextSummary;
  } catch (e) {
    console.warn("contextApi resonance fetch failed", e);
    return null;
  }
}
