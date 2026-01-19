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
      label: "Summary",
      content:
        "Candidate profile snapshot: title, current employer, core skills, mobility, and current stage details.",
    },
    {
      value: "salary",
      label: "Salary",
      content:
        "Salary expectation: 700k DKK base, hybrid 2 days on-site. Notes: open to bonus/equity mix if role includes architecture ownership.",
    },
    {
      value: "experience",
      label: "Experience",
      content:
        "Experience summary: 8+ years backend (TypeScript/Node/GraphQL/AWS), led teams of 4–6, designed event-driven systems, strong API design.",
    },
    {
      value: "education",
      label: "Educational background",
      content:
        "Education: M.Sc. Computer Science, DTU. Additional: AWS Solutions Architect Associate; internal mentorship program lead.",
    },
  ],
  Survey: [
    {
      value: "summary",
      label: "Summary of responses",
      content:
        "High satisfaction with process clarity; prefers concise feedback and shorter assessments. Timeline visibility rated 9/10.",
    },
    {
      value: "readiness",
      label: "Job change readiness",
      content:
        "Ready to move within 4–6 weeks. Open to hybrid roles; needs clear onboarding plan and growth path.",
    },
    {
      value: "salary",
      label: "Salary expectations",
      content:
        "Salary expectation range: 680k–720k DKK base; values equity and learning budget. Prefers capped on-call or rotation.",
    },
    {
      value: "engagement",
      label: "Engagement level",
      content:
        "Engagement: responds within 24h; opened outreach multiple times; active in follow-ups. Wants a practical tech conversation vs. long take-home.",
    },
  ],
  Copilot: [
    {
      value: "history-full",
      label: "Full history",
      content:
        "Full history: outreach opened 3x, reply within 4h; declined one role due to on-call load; prefers architecture input and capped rotations.",
    },
    {
      value: "history-3m",
      label: "3 months",
      content:
        "Last 3 months: two role explorations; seeking backend leadership with strong product input; prefers hybrid 2d/wk.",
    },
    {
      value: "history-6m",
      label: "6 months",
      content:
        "Last 6 months: evaluated fintech and AI roles; key motivators—team ownership and roadmap influence; avoids heavy on-call.",
    },
    {
      value: "history-9m",
      label: "9 months",
      content:
        "Last 9 months: considered senior IC and lead tracks; consistent preference for mentoring and API/platform work.",
    },
    {
      value: "history-12m",
      label: "12 months",
      content:
        "Last 12 months: multiple conversations across B2B SaaS; strongest fit when architecture and team leadership are combined.",
    },
  ],
  TalentRiver: [
    {
      value: "ls-health",
      label: "Life Science & Healthcare",
      content:
        "Life Science & Healthcare matches: roles emphasizing compliance-ready architectures and data privacy; candidate strong on APIs and eventing.",
    },
    {
      value: "industrial",
      label: "Industrial & Construction",
      content:
        "Industrial & Construction matches: platforms for logistics/IoT; candidate fit on cloud/backend; check comfort with OT/edge patterns.",
    },
    {
      value: "finance",
      label: "Finance",
      content:
        "Finance matches: API-led modernization and risk systems; candidate prefers limited on-call; good for platform/API squads.",
    },
    {
      value: "it-digital",
      label: "IT & Digital",
      content:
        "IT & Digital matches: strong alignment with product-engineering squads; candidate wants architecture input and mentorship duties.",
    },
    {
      value: "consumer",
      label: "Consumer",
      content:
        "Consumer matches: prefers roles with measurable customer impact; watch for late-night on-call requirements.",
    },
    {
      value: "public-ngos",
      label: "Public & NGOS",
      content:
        "Public & NGOs: candidate open if impact is clear; prefers modern stacks and transparent governance.",
    },
    {
      value: "defense",
      label: "Defense Industry",
      content:
        "Defense industry: evaluate clearance needs; candidate open to security-focused backend work if remote/hybrid is possible.",
    },
  ],
  Quill: [
    {
      value: "summary",
      label: "Summary",
      content:
        "Recent calls summarized: team structure, comp bands, tech stack; candidate asked for incident runbook examples.",
    },
    {
      value: "interview-1",
      label: "Interview 1",
      content:
        "Interview 1: discovery call; discussed role scope, architecture expectations, and on-call policy.",
    },
    {
      value: "interview-2",
      label: "Interview 2",
      content:
        "Interview 2: deeper tech conversation on API design and event-driven patterns; candidate wants clear ownership areas.",
    },
    {
      value: "interview-3",
      label: "Interview 3",
      content:
        "Interview 3: focus on team fit and leadership style; candidate values mentorship and transparent decision-making.",
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

            {!canUseContext && (
              <div className="integration-tip muted">
                Tip: Evaluate a candidate to unlock the Candidate AI Context Explorer.
              </div>
            )}

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
    </div>
  );
}
