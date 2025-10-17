import { useState } from "react";
import Header from "./components/Header";
import UploadCard from "./components/UploadCard";
import Footer from "./components/Footer";
import ResultPanel from "./components/ResultPanel";
import { uploadAndScore } from "./api/match";
import type { MatchResponse } from "./api/types";

export default function App() {
  const [jd, setJd] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResponse | null>(null);

  const canStart = Boolean(jd && cv);

  const handleStart = async () => {
    if (!jd || !cv) return;
    setError(null);
    setResult(null);
    try {
      setLoading(true);
      const data = await uploadAndScore(cv, jd, "en");
      setResult(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Scoring failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <div className="center">
        <div>
          <UploadCard
            onPickJD={setJd}
            onPickCV={setCv}
            onStart={handleStart}
            disabled={!canStart || loading}
          />
          {loading && (
            <div className="card" style={{ marginTop: 16, textAlign: "center" }}>
              Scoring… please wait
            </div>
          )}
          {error && (
            <div className="card" style={{ marginTop: 16, color: "#b91c1c" }}>
              {error}
            </div>
          )}
          {result && <ResultPanel data={result} />}
        </div>
      </div>
      <Footer />
    </div>
  );
}
