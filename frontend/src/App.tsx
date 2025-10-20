import { useState } from "react";
import { Header } from "./components/Header";
import { UploadCard } from "./components/UploadCard";
import { ResultPanel } from "./components/ResultPanel";
import { Footer } from "./components/Footer";
import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
} from "framer-motion";
import { evaluateUpload, type Provider, type MatchResponse } from "./api/match";

export default function App() {
  const [provider, setProvider] = useState<Provider>("OpenAI");

  // Files
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);

  // Result + UI
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false); // controls layout transition

  function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return "Unexpected error occurred.";
  }

  async function onEvaluate(): Promise<void> {
    setError(null);
    setResult(null);
    setStarted(true); // reveal results column + trigger layout shift
    setLoading(true);

    try {
      if (!cvFile || !jdFile) {
        throw new Error("Please upload both CV and Job Description (PDF/DOCX).");
      }
      const resp = await evaluateUpload(provider, cvFile, jdFile);
      setResult(resp);
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <Header provider={provider} onChangeProvider={setProvider} />

      {/* Stage switches from centered → split grid */}
      <motion.div
        className={`stage ${started ? "stage--split" : "stage--center"}`}
        animate={started ? "split" : "center"}
        initial={false}
        variants={stageVariants}
      >
        {/* Upload Panel */}
        <motion.div
          layout
          layoutId="panel-upload"
          className="card"
          variants={panelVariants}
          animate={started ? "left" : "center"}
          transition={spring}
        >
          <UploadCard
            cvFile={cvFile}
            jdFile={jdFile}
            onCvFileChange={setCvFile}
            onJdFileChange={setJdFile}
            onEvaluate={onEvaluate}
            loading={loading}
          />
        </motion.div>

        {/* Results Panel (hidden until Evaluate pressed) */}
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
              transition={{ duration: 0.45, ease: "easeOut" }}
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

/* -------- Motion presets (typed) -------- */
const spring: Transition = { type: "spring", stiffness: 240, damping: 24 };

const stageVariants: Variants = {
  center: { transition: { when: "beforeChildren" as const } },
  split: { transition: { when: "beforeChildren" as const } },
};

const panelVariants: Variants = {
  center: { x: 0, scale: 1, transition: spring },
  left: { x: 0, scale: 1, transition: spring }, // grid handles placement; spring keeps it snappy
};
