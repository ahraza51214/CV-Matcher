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
import { exportCandidateView } from "./utils/exportCandidateView";

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

  const handleExportPdf = () => {
    // Delegate export to dedicated utility for single-responsibility.
    exportCandidateView({ result, pinnedCards });
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
