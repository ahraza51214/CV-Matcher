import { useEffect, useMemo, useState } from "react";

import { createCard, TOOL_DATA } from "./contextData";
import type { ResultCard, ToolId } from "./types";

type UseContextExplorerStateProps = {
  resetSignal?: number;
  canUseContext: boolean;
};

export function useContextExplorerState({
  resetSignal = 0,
  canUseContext,
}: UseContextExplorerStateProps) {
  const [tool, setTool] = useState<ToolId | "">("");
  const [option, setOption] = useState<string>("");
  const [currentCard, setCurrentCard] = useState<ResultCard | null>(null);
  const [pinnedCards, setPinnedCards] = useState<ResultCard[]>([]);
  const [keepCurrent, setKeepCurrent] = useState(false);

  const optionsForTool = useMemo(
    () => (tool ? TOOL_DATA[tool] : []),
    [tool],
  );

  const hasContent = !!currentCard || pinnedCards.length > 0;

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

  const toggleKeepCurrent = () => setKeepCurrent((v) => !v);

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

  return {
    tool,
    option,
    optionsForTool,
    currentCard,
    pinnedCards,
    keepCurrent,
    hasContent,
    handleToolChange,
    handleOptionChange,
    toggleKeepCurrent,
    handleUnpin,
  };
}
