// Shared types for context explorer tools, options, and rendered cards.
export type ToolId = "Invenias" | "Survey" | "Copilot" | "TalentRiver" | "Quill";

export type ToolOption = {
  value: string;
  label: string;
  content: string;
};

export type ResultCard = {
  id: string;
  tool: ToolId;
  label: string;
  content: string;
};
