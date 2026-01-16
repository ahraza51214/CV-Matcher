import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { UploadPanel } from "./components/upload/UploadPanel";
import { ResultPanel } from "./components/result/ResultPanel";
import { IntegrationExplorer } from "./components/integration/IntegrationExplorer";

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
  const [provider, setProvider] = useState<Provider>("ChatGPT");
  const [integrationReset, setIntegrationReset] = useState(0);
  const { cvFile, jdFile, setCvFile, setJdFile } = useUploadState();
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
    setCvFile(null);
    setJdFile(null);
    setIntegrationReset((n) => n + 1);
    requestClose();
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

      <IntegrationExplorer resetSignal={integrationReset} canUseContext={started} />

      <Footer />
    </div>
  );
}
