import { api } from "./client";
import type { MatchResponse } from "./types";

export async function uploadAndScore(cv: File, jd: File, lang = "en"): Promise<MatchResponse> {
  const form = new FormData();
  form.append("cv", cv);
  form.append("jd", jd);
  form.append("lang", lang);

  const res = await api.post<MatchResponse>("/match", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
