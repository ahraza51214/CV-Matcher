// Root application shell wiring upload, result, and context explorer panels with shared motion choreography.
// Root application shell wiring upload, result, and context explorer panels with shared motion choreography.
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { UploadPanel } from "./components/uploadPanel/UploadPanel";
import { ResultPanel } from "./components/resultPanel/ResultPanel";
import { ContextExplorerPanel } from "./components/contextExplorerPanel/ContextExplorerPanel";
import type { ResultCard } from "./components/contextExplorerPanel/types";

import { useUploadState } from "./hooks/useUploadState";
import { useEvaluation } from "./hooks/useEvaluation";
import { usePanelsChoreography } from "./hooks/usePanelsChoreography";

import {
  stageVariants,
  uploadSolid,
  resultZoom,
  timeline,
} from "./motion/presets";

import type { Provider } from "./api/types";

export default function App() {
  // Active LLM provider for evaluation requests.
  const [provider, setProvider] = useState<Provider>("ChatGPT");
  // Used to force-reset context explorer state after closing results.
  const [integrationReset, setIntegrationReset] = useState(0);
  // Track pinned context cards for export.
  const [pinnedCards, setPinnedCards] = useState<ResultCard[]>([]);
  // File uploads for CV and JD.
  const { cvFile, jdFile, setCvFile, setJdFile } = useUploadState();
  // Evaluation lifecycle (loading/result/error + start/stop).
  const { result, loading, error, started, run, dismiss } = useEvaluation(provider);

  // All the “closing/width-lock” choreography lives in this hook
  const {
    uploadRef,
    showResults,
    stageClass,
    stageAnimate,
    uploadAnimate,
    requestClose,
    onExitComplete,
  } = usePanelsChoreography(started, dismiss);

  const handleCloseResults = () => {
    // Reset everything when user closes results.
    setCvFile(null);
    setJdFile(null);
    setIntegrationReset((n) => n + 1);
    requestClose();
  };

  const handlePinnedChange = useCallback((cards: ResultCard[]) => {
    setPinnedCards(cards);
  }, []);

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

  const handleExportPdf = () => {
    if (!result && pinnedCards.length === 0) return;
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
  };

  return (
    <div className="container">
      <Header provider={provider} onChangeProvider={setProvider} />

        {/* Stage: center (only upload) → split (upload + results) */}
        <motion.div
          className={`stage ${stageClass}`}
          animate={stageAnimate}
          initial={false}
          variants={stageVariants}
        >
          {/* Upload: solid translate; width adjusts naturally with layout */}
          <motion.div
            ref={uploadRef}
            className="card card--upload"
            variants={uploadSolid}
            animate={uploadAnimate}
            transition={timeline}
          >
          <UploadPanel
            cvFile={cvFile}
            jdFile={jdFile}
            onCv={setCvFile}
            onJd={setJdFile}
            onEvaluate={() => run(cvFile, jdFile)}
            onExport={handleExportPdf}
            exportDisabled={!result && pinnedCards.length === 0}
            loading={loading}
          />
        </motion.div>

        {/* Result: zooms in/out; grid collapses only after exit completes */}
        <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
          {showResults && (
            <motion.div
              key="results"
              className="card card--result"
              initial={resultZoom.initial}
              animate={resultZoom.animate}
              exit={resultZoom.exit}
              transition={resultZoom.transition}
            >
              <ResultPanel
                result={result}
                loading={loading}
                error={error}
                onClose={handleCloseResults}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ContextExplorerPanel
        resetSignal={integrationReset}
        canUseContext={started}
        onPinnedChange={handlePinnedChange}
      />

      <Footer />
    </div>
  );
}
