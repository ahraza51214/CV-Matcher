import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { stageVariants, uploadSolid, resultZoom, timeline } from "../../motion/presets";
import { usePanelsChoreography } from "../../hooks/usePanelsChoreography";

type ToolId = "Invenias" | "Survey" | "Copilot" | "TalentRiver" | "Quill";

type ToolOption = {
  value: string;
  label: string;
  content: string;
};

type ResultCard = {
  id: string;
  tool: ToolId;
  label: string;
  content: string;
};

const TOOL_DATA: Record<ToolId, ToolOption[]> = {
  Invenias: [
    {
      value: "profile",
      label: "Candidate profile snapshot",
      content:
        "Current title: Senior Backend Engineer at NordTek. Skills: TypeScript, Node, GraphQL, AWS. Mobility: Copenhagen/Remote. Next step: Panel interview scheduled for Thursday.",
    },
    {
      value: "notes",
      label: "Recent recruiter notes",
      content:
        "Recruiter note (2d ago): Prefers teams with clear code ownership. Open to fintech/AI. Salary expectation: 700k DKK base. Prefers hybrid 2 days on-site.",
    },
  ],
  Survey: [
    {
      value: "csat",
      label: "Candidate satisfaction (latest)",
      content:
        "Survey completed 2024-06-12. Score: 8/10. Comment: “Great clarity on process and timeline. Would like earlier feedback on coding task scope.”",
    },
    {
      value: "nps",
      label: "Net promoter trend",
      content:
        "Rolling 30-day NPS for this candidate’s journey: +32. Strongest drivers: transparent timeline, fast scheduling. Friction: task instructions detail.",
    },
  ],
  Copilot: [
    {
      value: "history",
      label: "Candidate history summary",
      content:
        "Outreach opened 3 times; replied within 4 hours. Past roles matched to staff+ IC track. Previously declined a role due to on-call load; prefers capped rotations.",
    },
    {
      value: "context",
      label: "Role fit signals",
      content:
        "Signals flagged: B2B SaaS scaling experience, strong API design, mentorship of 4+ engineers. Risk: limited greenfield in last role; prefers architecture input.",
    },
  ],
  TalentRiver: [
    {
      value: "match",
      label: "Talent Match recommendations",
      content:
        "Match score: 87 for Backend Lead (Copenhagen). Highlights: event-driven systems, AWS, hiring experience. Gaps: limited Rust exposure requested by team.",
    },
    {
      value: "pipeline",
      label: "Pipeline position",
      content:
        "Currently in shortlist for two roles. Next action: send take-home alternative (pairing) per candidate preference to avoid long assignments.",
    },
  ],
  Quill: [
    {
      value: "calls",
      label: "Call history (recent)",
      content:
        "Last call 2024-06-18 (17 min). Topics: team structure, compensation bands, tech stack. Candidate asked for example incident runbooks; follow-up sent.",
    },
    {
      value: "transcript",
      label: "Call summary cues",
      content:
        "Key cues: values concise feedback, prefers async updates. Mentioned relocating in Q1 next year; willing to start remote then move.",
    },
  ],
};

export function IntegrationExplorer({
  resetSignal = 0,
  canUseContext = true,
}: {
  resetSignal?: number;
  canUseContext?: boolean;
}) {
  const [tool, setTool] = useState<ToolId | "">("");
  const [option, setOption] = useState<string>("");
  const [currentCard, setCurrentCard] = useState<ResultCard | null>(null);
  const [pinnedCards, setPinnedCards] = useState<ResultCard[]>([]);
  const [keepCurrent, setKeepCurrent] = useState(false);
  const hasContent = !!currentCard || pinnedCards.length > 0;

  const {
    showResults,
    stageAnimate,
    uploadAnimate,
    onExitComplete,
  } = usePanelsChoreography(hasContent, () => {});

  const optionsForTool = useMemo(
    () => (tool ? TOOL_DATA[tool] : []),
    [tool],
  );

  const createCard = (toolId: ToolId, opt: ToolOption): ResultCard => ({
    id: `${toolId}-${opt.value}-${Date.now()}`,
    tool: toolId,
    label: opt.label,
    content: opt.content,
  });

  const finalizeCurrentIfKept = () => {
    if (currentCard && keepCurrent) {
      setPinnedCards((prev) => [currentCard, ...prev]);
    }
    setKeepCurrent(false);
  };

  const handleToolChange = (value: string) => {
    finalizeCurrentIfKept();
    if (value === "") {
      setTool("");
      setOption("");
      setCurrentCard(null);
      return;
    }

    setTool(value as ToolId);
    setOption("");
    setCurrentCard(null);
  };

  const handleOptionChange = (value: string) => {
    finalizeCurrentIfKept();
    setOption(value);

    if (!value || !tool) {
      setCurrentCard(null);
      return;
    }

    const currentTool = tool as ToolId;
    const target = TOOL_DATA[currentTool].find((opt) => opt.value === value);
    if (target) {
      setCurrentCard(createCard(currentTool, target));
    }
  };

  const handleUnpin = (id: string) => {
    setPinnedCards((prev) => prev.filter((card) => card.id !== id));
    if (currentCard && currentCard.id === id) {
      setCurrentCard(null);
      setKeepCurrent(false);
    }
  };

  useEffect(() => {
    setTool("");
    setOption("");
    setCurrentCard(null);
    setPinnedCards([]);
    setKeepCurrent(false);
  }, [resetSignal, canUseContext]);

  return (
    <div className="integration-section">
      <motion.div
        className={`integration-grid ${showResults ? "integration-grid--split" : "integration-grid--solo"}`}
        variants={stageVariants}
        animate={stageAnimate}
        initial={false}
        transition={timeline}
      >
        <motion.div
          className="integration-panel card"
          variants={uploadSolid}
          animate={uploadAnimate}
          transition={timeline}
          initial={false}
        >
          <div className="integration-panel__header">
            <div>
              <p className="integration-panel__eyebrow">Candidate AI Context Explorer</p>
            </div>
          </div>
          <div className="integration-panel__controls">
            <label className="integration-panel__label" htmlFor="tool-select">
              Select tool
            </label>
            <div className="integration-panel__field">
              <select
                id="tool-select"
                className="integration-panel__select"
                value={tool}
                disabled={!canUseContext}
                onChange={(e) => handleToolChange(e.target.value)}
              >
                <option value="">Choose a tool</option>
                <option value="Invenias">Invenias</option>
                <option value="Survey">Survey</option>
                <option value="Copilot">Copilot</option>
                <option value="TalentRiver">TalentRiver</option>
                <option value="Quill">Quill </option>
              </select>
            </div>

            {tool && (
              <div className="integration-panel__secondary">
                <label className="integration-panel__label" htmlFor="data-select">
                  Select data option from {tool}
                </label>
                <div className="integration-panel__field">
                  <select
                    id="data-select"
                    className="integration-panel__select"
                    value={option}
                    disabled={!canUseContext}
                    onChange={(e) => handleOptionChange(e.target.value)}
                  >
                    <option value="">Choose a data option</option>
                    {optionsForTool.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
          {showResults && canUseContext && (
            <motion.div
              className="integration-results-column card"
              initial={resultZoom.initial}
              animate={resultZoom.animate}
              exit={resultZoom.exit}
              transition={resultZoom.transition}
            >
              <AnimatePresence initial={false}>
                {pinnedCards.map((card) => (
                  <motion.div
                    key={card.id}
                    className="card card--result integration-result-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="integration-result-card__top">
                      <p className="integration-panel__pill">
                        {card.tool} • {card.label}
                      </p>
                      <button
                        type="button"
                        className="integration-unpin"
                        onClick={() => handleUnpin(card.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <p className="integration-panel__text">{card.content}</p>
                  </motion.div>
                ))}
              </AnimatePresence>

              <AnimatePresence initial={false}>
                {currentCard && (
                  <motion.div
                    key={currentCard.id}
                    className="card card--result integration-result-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="integration-result-card__top">
                      <p className="integration-panel__pill">
                        {currentCard.tool} • {currentCard.label}
                      </p>
                      <button
                        type="button"
                        className={`integration-keep-btn ${keepCurrent ? "integration-keep-btn--active" : ""}`}
                        onClick={() => setKeepCurrent((v) => !v)}
                      >
                        {keepCurrent ? "Remove" : "Keep"}
                      </button>
                    </div>
                    <p className="integration-panel__text">{currentCard.content}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {!canUseContext && (
        <div className="integration-locked">
          <p className="integration-locked__text">Evaluate a candidate to unlock the Candidate AI Context Explorer.</p>
        </div>
      )}
    </div>
  );
}
