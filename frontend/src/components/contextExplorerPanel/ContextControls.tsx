// Control panel for picking a tool and data option in the context explorer.
import type { ToolId, ToolOption } from "./types";

type ContextControlsProps = {
  tool: ToolId | "";
  option: string;
  optionsForTool: ToolOption[];
  canUseContext: boolean;
  onToolChange: (value: string) => void;
  onOptionChange: (value: string) => void;
};

export function ContextControls({
  tool,
  option,
  optionsForTool,
  canUseContext,
  onToolChange,
  onOptionChange,
}: ContextControlsProps) {
  return (
    <>
      <div className="integration-panel__header">
        <div>
          <p className="integration-panel__eyebrow">Candidate AI Context Explorer</p>
        </div>
      </div>

      <div className="integration-panel__controls">
        {/* Primary tool selector */}
        <label className="integration-panel__label" htmlFor="tool-select">
          Select tool
        </label>
        <div className="integration-panel__field">
          <select
            id="tool-select"
            className="integration-panel__select"
            value={tool}
            disabled={!canUseContext}
            onChange={(e) => onToolChange(e.target.value)}
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
          /* Secondary selector for data options inside chosen tool */
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
                onChange={(e) => onOptionChange(e.target.value)}
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
    </>
  );
}
