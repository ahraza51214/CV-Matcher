// Builds and renders a print-friendly 360° candidate view for PDF export.
import type { MatchResponse } from "../api/types";
import type { ResultCard } from "../components/contextExplorerPanel/types";

type ExportCandidateViewParams = {
  result: MatchResponse | null;
  pinnedCards: ResultCard[];
};

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const renderList = (items: string[]) => {
  if (!items || items.length === 0) return "<p><em>None provided.</em></p>";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
};

export function exportCandidateView({ result, pinnedCards }: ExportCandidateViewParams) {
  if (!result && pinnedCards.length === 0) return;
  if (typeof window === "undefined") return;

  const printable = window.open("", "_blank", "width=900,height=1000");
  if (!printable) return;

  const reasoning = result?.reasoning ? escapeHtml(result.reasoning) : "None provided.";
  const pros = renderList(result?.pros || []);
  const cons = renderList(result?.cons || []);
  const pinned = pinnedCards.length
    ? pinnedCards.map((card) => (
      `<div class="card">
        <div class="card-head">
          <strong>${escapeHtml(card.tool)}</strong> • ${escapeHtml(card.label)}
        </div>
        <div>${escapeHtml(card.content)}</div>
      </div>`
    )).join("")
    : "<p><em>No pinned cards.</em></p>";

  printable.document.write(`<!doctype html>
    <html>
      <head>
        <title>360 Degree Candidate View</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
          h1 { margin: 0 0 12px; }
          h2 { margin-top: 24px; margin-bottom: 8px; }
          .card { border: 1px solid #d8d8d8; border-radius: 10px; padding: 12px; margin-bottom: 10px; }
          .card-head { margin-bottom: 6px; }
          ul { padding-left: 18px; }
          .pill { display: inline-block; padding: 4px 8px; border-radius: 12px; background: #eef4ff; border: 1px solid #d7e2ff; font-size: 12px; }
          .meta { margin-top: 8px; }
        </style>
      </head>
      <body>
        <h1>360 Degree Candidate View</h1>
        ${result ? `
          <div class="card">
            <div class="pill">Match Score: ${result.matchScore}/100</div>
            <div class="meta">Band: ${escapeHtml(result.band || "N/A")}</div>
            <h2>Summary</h2>
            <p>${reasoning}</p>
            <h2>Pros</h2>
            ${pros}
            <h2>Cons</h2>
            ${cons}
          </div>
        ` : "<p><em>No match result yet.</em></p>"}
        <h2>Pinned Context Cards</h2>
        ${pinned}
      </body>
    </html>`);
  printable.document.close();
  printable.focus();
  printable.print();
}
