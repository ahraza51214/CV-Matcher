// Client call to send CV/JD files for matching and return the backend response.
import { BASE_URL } from "./client";
import type { Provider, MatchResponse } from "./types";

export async function evaluateUpload(
  provider: Provider,
  cvFile: File,
  jdFile: File
): Promise<MatchResponse> {
  // Build multipart form data payload.
  const fd = new FormData();
  fd.append("cv", cvFile);
  fd.append("jd", jdFile);

  // POST to backend matcher with provider query param.
  const res = await fetch(`${BASE_URL}/match?provider=${encodeURIComponent(provider)}`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
