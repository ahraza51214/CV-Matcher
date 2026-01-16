import { useMemo, useState } from "react";

type ToolId = "Invenias" | "Survey" | "Copilot" | "TalentRiver" | "Quill";

type ToolOption = {
  value: string;
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

export function IntegrationExplorer() {
  const [tool, setTool] = useState<ToolId | "">("");
  const [option, setOption] = useState<string>("");

  const optionsForTool = useMemo(
    () => (tool ? TOOL_DATA[tool] : []),
    [tool],
  );

  const selectedOption = useMemo(
    () => optionsForTool.find((opt) => opt.value === option),
    [optionsForTool, option],
  );

  const handleToolChange = (value: string) => {
    if (value === "") {
      setTool("");
      setOption("");
      return;
    }

    setTool(value as ToolId);
    setOption("");
  };

  return (
    <div className="integration-panel card">
      <div className="integration-panel__header">
        <div>
          <p className="integration-panel__eyebrow">Candidate Context AI explorer</p>
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
                onChange={(e) => setOption(e.target.value)}
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

      {selectedOption && (
        <div className="integration-panel__result bordered">
          <p className="integration-panel__pill">
            {tool} • {selectedOption.label}
          </p>
          <p className="integration-panel__text">{selectedOption.content}</p>
        </div>
      )}
    </div>
  );
}
