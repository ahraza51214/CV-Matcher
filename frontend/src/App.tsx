import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { UploadPanel } from "./components/upload/UploadPanel";
import { ResultPanel } from "./components/result/ResultPanel";

import { useUploadState } from "./hooks/useUploadState";
import { useEvaluation } from "./hooks/useEvaluation";
import { stageVariants, panelVariants, spring } from "./motion/presets";

import type { Provider } from "./api/types";


export default function App() {
  const [provider, setProvider] = useState<Provider>("OpenAI");
  const { cvFile, jdFile, setCvFile, setJdFile } = useUploadState();
  const { result, loading, error, started, run } = useEvaluation(provider);

  return (
    <div className="container">
      <Header provider={provider} onChangeProvider={setProvider} />

      <motion.div
        className={`stage ${started ? "stage--split" : "stage--center"}`}
        animate={started ? "split" : "center"}
        initial={false}
        variants={stageVariants}
      >
        <motion.div
          layout
          layoutId="panel-upload"
          className="card"
          variants={panelVariants}
          animate={started ? "left" : "center"}
          transition={spring}
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

        <AnimatePresence mode="wait">
          {started && (
            <motion.div
              key="results"
              layout
              layoutId="panel-result"
              className="card"
              initial={{ opacity: 0, x: 28, filter: "blur(14px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 28, filter: "blur(14px)" }}
              transition={{
                duration: 0.9,
                ease: [0.25, 0.1, 0.25, 1], // smooth cubic-bezier easing
                opacity: { duration: 1.1 },
                filter: { duration: 0.8 },
                x: { duration: 0.8 },
              }}
            >
              <ResultPanel result={result} loading={loading} error={error} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Footer />
    </div>
  );
}
